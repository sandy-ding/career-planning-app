import React, { useState, useEffect, useRef } from "react";
import isEqual from "react-fast-compare";
import styles from "./styles";
import {
  Map,
  Container,
  MapAreas,
  CustomArea,
  AreaEvent,
  ImageMapperProps,
} from "./types";
import { rerenderPropsList, ImageMapperDefaultProps } from "./constants";
import callingFn from "./draw";
import {
  mouseMove,
  imageMouseMove,
  imageClick,
  mouseDown,
  mouseUp,
  touchStart,
  touchEnd,
} from "./events";

export * from "./types";

const ImageMapper: React.FC<ImageMapperProps> = (props: ImageMapperProps) => {
  const {
    containerRef,
    active,
    disabled,
    fillColor: fillColorProp,
    lineWidth: lineWidthProp,
    map: mapProp,
    src: srcProp,
    strokeColor: strokeColorProp,
    natural,
    height: heightProp,
    width: widthProp,
    imgWidth: imageWidthProp,
    areaKeyName = "id",
    stayHighlighted,
    stayMultiHighlighted,
    toggleHighlighted,
    parentWidth,
    responsive,
    spotDifference,
    onLoad,
    onMouseEnter,
    onMouseLeave,
    onClick,
  } = props;

  const [map, setMap] = useState<Map | undefined>(mapProp);
  const [storedMap, setStoredMap] = useState<Map | undefined>(map);
  const [isRendered, setRendered] = useState<boolean>(false);
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);
  const container = useRef<Container>(null);
  const img = useRef<HTMLImageElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const isInitialMount = useRef<boolean>(true);
  const interval = useRef<number>(0);
  const [left, setLeft] = useState<string>();
  const [right, setRight] = useState<string>();

  useEffect(() => {
    if (!isRendered) {
      interval.current = window.setInterval(() => {
        if (img.current?.complete) setRendered(true);
      }, 500);
    } else {
      clearInterval(interval.current);
    }
  }, [isRendered]);

  useEffect(() => {
    if (isRendered && canvas.current) {
      initCanvas(true);
      ctx.current = canvas.current.getContext("2d");
      updateCacheMap();
    }
  }, [isRendered]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      updateCacheMap();
      initCanvas();
      if (imgRef) updateCanvas();
    }
  }, [props, isInitialMount, imgRef]);

  useEffect(() => {
    if (container.current) {
      container.current.clearHighlightedArea = () => {
        setMap(storedMap);
        initCanvas();
      };
      if (containerRef) {
        containerRef.current = container.current;
      }
    }
  }, [imgRef]);

  useEffect(() => {
    if (responsive) initCanvas();
  }, [parentWidth]);

  const updateCacheMap = () => {
    setMap(mapProp);
    setStoredMap(mapProp);
  };

  const getDimensions = (type: "width" | "height"): number => {
    const { [type]: dimension } = props;

    if (typeof dimension === "function") {
      // @ts-ignore
      return dimension(img.current);
    }
    return dimension as number;
  };

  const getValues = (type: string, measure: number, name = "area") => {
    const { naturalWidth, naturalHeight, clientWidth, clientHeight } =
      img.current || {};

    if (type === "width") {
      if (responsive) return parentWidth;
      if (natural) return naturalWidth;
      if (widthProp || name === "image") return measure;
      return clientWidth;
    }
    if (type === "height") {
      if (responsive) return clientHeight;
      if (natural) return naturalHeight;
      if (heightProp || name === "image") return measure;
      return clientHeight;
    }
    return 0;
  };

  const initCanvas = (firstLoad = false) => {
    if (!firstLoad && !imgRef) return;

    const imgWidth = getDimensions("width") as number;
    const imgHeight = getDimensions("height") as number;
    const imageWidth = getValues("width", imgWidth) as number;
    const imageHeight = getValues("height", imgHeight) as number;

    if ((widthProp || responsive) && img.current) {
      img.current.width = getValues("width", imgWidth, "image") as number;
    }

    if ((heightProp || responsive) && img.current) {
      img.current.height = getValues("height", imgHeight, "image") as number;
    }

    if (canvas.current) {
      canvas.current.width = imageWidth;
      canvas.current.height = imageHeight;
      ctx.current = canvas.current.getContext("2d");
    }
    if (container.current) {
      container.current.style.width = `${imageWidth}px`;
      container.current.style.height = `${imageHeight}px`;
    }
    if (ctx.current) {
      ctx.current.fillStyle = fillColorProp as string;
    }

    if (onLoad && imgRef && img.current) {
      onLoad(img.current, {
        width: imageWidth,
        height: imageHeight,
      });
    }

    setImgRef(img.current);
    if (imgRef) renderPrefilledAreas();
  };

  const highlightArea = (area: CustomArea) =>
    callingFn(
      area.shape,
      area.scaledCoords,
      area.fillColor || fillColorProp || "",
      area.lineWidth || lineWidthProp || 0,
      area.strokeColor || strokeColorProp || "",
      area.active ?? true,
      ctx
    );

  const clearCanvas = () =>
    ctx.current &&
    canvas.current &&
    ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);

  const hoverOn = (area: CustomArea, index?: number, event?: AreaEvent) => {
    // if (active) highlightArea(area);

    if (onMouseEnter) onMouseEnter(area, index, event);
  };

  const hoverOff = (area: CustomArea, index: number, event: AreaEvent) => {
    if (active) {
      clearCanvas();
      renderPrefilledAreas();
    }

    if (onMouseLeave) onMouseLeave(area, index, event);
  };

  const click = (area: CustomArea, index: number, event: AreaEvent) => {
    const isAreaActive = area.active ?? true;
    const { name } = area;
    const [section, num] = name.split("-");
    let updatedAreas: MapAreas[] = [];
    let shouldHighlight;

    if (spotDifference) {
      if (section === "left") {
        shouldHighlight = true;
        setLeft(num);
      }
      if (section === "right") {
        setRight(num);
        shouldHighlight = left === num;
        if (!shouldHighlight) {
          setLeft("");
        }
      }
    }

    if (
      isAreaActive &&
      (stayHighlighted || stayMultiHighlighted || toggleHighlighted)
    ) {
      const newArea = { ...area };
      const chosenArea = stayMultiHighlighted ? map : storedMap;

      if (toggleHighlighted && newArea.preFillColor) {
        const isPreFillColorFromJSON = storedMap?.areas.find(
          (c) => c[areaKeyName] === area[areaKeyName]
        );

        if (isPreFillColorFromJSON && !isPreFillColorFromJSON.preFillColor) {
          delete newArea.preFillColor;
        }
      } else if (
        (stayHighlighted || stayMultiHighlighted) &&
        (!spotDifference || shouldHighlight)
      ) {
        newArea.preFillColor = area.fillColor || fillColorProp;
      }

      updatedAreas =
        chosenArea?.areas.map((cur) =>
          cur[areaKeyName] === area[areaKeyName] ? newArea : cur
        ) || [];
      // @ts-ignore
      setMap((prev) => ({ ...prev, areas: updatedAreas }));

      if (!stayMultiHighlighted) {
        updateCanvas();
        highlightArea(area);
      }
    }

    if (onClick) {
      event.preventDefault();
      onClick(area, index, event, updatedAreas);
    }
  };

  const scaleCoords = (coords: number[]): number[] => {
    const scale =
      widthProp && imageWidthProp && imageWidthProp > 0
        ? (widthProp as number) / imageWidthProp
        : 1;
    if (responsive && parentWidth && imgRef) {
      return coords.map((coord) => coord / (imgRef.naturalWidth / parentWidth));
    }
    return coords.map((coord) => coord * scale);
  };

  const renderPrefilledAreas = (mapObj: Map | undefined = map) => {
    mapObj?.areas.forEach((area) => {
      if (!area.preFillColor) return false;
      callingFn(
        area.shape,
        scaleCoords(area.coords),
        area.preFillColor,
        area.lineWidth || lineWidthProp || 0,
        area.strokeColor || strokeColorProp || "",
        true,
        ctx
      );
      return true;
    });
  };

  const computeCenter = (area: MapAreas): [number, number] => {
    if (!area) return [0, 0];

    const scaledCoords = scaleCoords(area.coords);

    switch (area.shape) {
      case "circle":
        return [scaledCoords[0], scaledCoords[1]];
      case "poly":
      case "rect":
      default: {
        const n = scaledCoords.length / 2;
        const { y: scaleY, x: scaleX } = scaledCoords.reduce(
          ({ y, x }, val, idx) =>
            !(idx % 2) ? { y, x: x + val / n } : { y: y + val / n, x },
          { y: 0, x: 0 }
        );
        return [scaleX, scaleY];
      }
    }
  };

  const updateCanvas = () => {
    clearCanvas();
    renderPrefilledAreas(mapProp);
  };

  const renderAreas = () =>
    map?.areas.map((area, index) => {
      const scaledCoords = scaleCoords(area.coords);
      const center = computeCenter(area);
      const extendedArea = { ...area, scaledCoords, center };

      if (area.disabled) return null;

      return (
        <area
          {...(area.preFillColor
            ? { className: "img-mapper-area-highlighted" }
            : {})}
          key={area[areaKeyName!] || index.toString()}
          shape={area.shape}
          coords={scaledCoords.join(",")}
          onMouseEnter={(event) => hoverOn(extendedArea, index, event)}
          onMouseLeave={(event) => hoverOff(extendedArea, index, event)}
          onMouseMove={(event) => mouseMove(extendedArea, index, event, props)}
          onMouseDown={(event) => mouseDown(extendedArea, index, event, props)}
          onMouseUp={(event) => mouseUp(extendedArea, index, event, props)}
          onTouchStart={(event) =>
            touchStart(extendedArea, index, event, props)
          }
          onTouchEnd={(event) => touchEnd(extendedArea, index, event, props)}
          onClick={(event) => click(extendedArea, index, event)}
          href={area.href}
          alt="map"
        />
      );
    });

  return (
    <div ref={container} id="img-mapper" style={styles(props).container}>
      <img
        ref={img}
        role="presentation"
        className="img-mapper-img"
        style={{
          ...styles(props).img,
          ...(!imgRef ? { display: "none" } : {}),
        }}
        src={srcProp}
        useMap={`#${map?.name}`}
        alt="map"
        onClick={(event) => imageClick(event, props)}
        onMouseMove={(event) => imageMouseMove(event, props)}
      />
      <canvas
        ref={canvas}
        className="img-mapper-canvas"
        style={styles().canvas}
      />
      <map className="img-mapper-map" name={map?.name} style={styles().map}>
        {isRendered && !disabled && imgRef && renderAreas()}
      </map>
    </div>
  );
};

ImageMapper.defaultProps = ImageMapperDefaultProps;

export default React.memo<ImageMapperProps>(
  ImageMapper,
  (prevProps, nextProps) => {
    const watchedProps = [...rerenderPropsList, ...nextProps.rerenderProps!];

    const propChanged = watchedProps.some(
      // @ts-ignore
      (prop) => prevProps[prop] !== nextProps[prop]
    );

    return isEqual(prevProps.map, nextProps.map) && !propChanged;
  }
);
