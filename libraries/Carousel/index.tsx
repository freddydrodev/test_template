import * as React from "react";
import { FlatList, FlatListProps } from "react-native";
import { CarouselProperties } from "react-native-snap-carousel";

interface ICarouselProps extends CarouselProperties<any> {
  [other: string]: any;
}

const Carousel: React.FC<ICarouselProps> = ({ renderItem, data }) => {
  return (
    <FlatList
      style={{ paddingHorizontal: 20 }}
      data={data}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Carousel;
