import * as React from "react";
import { Dimensions, FlatListProps } from "react-native";
import RNSC, { CarouselProperties } from "react-native-snap-carousel";

const { width: viewportWidth } = Dimensions.get("window");

function wp(percentage: number) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const itemWidth = slideWidth + itemHorizontalMargin * 2;

const sliderWidth = viewportWidth;

interface ICarouselProps extends CarouselProperties<any> {}

const Carousel: React.FC<ICarouselProps> = ({
  renderItem,
  data,
  onSnapToItem,
}) => {
  return (
    <RNSC
      onSnapToItem={onSnapToItem}
      data={data}
      renderItem={renderItem}
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
    />
  );
};

export default Carousel;
