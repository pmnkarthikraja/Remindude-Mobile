import NativeItem from "@/components/ItemNative";
import { HeaderTitle } from "@/components/SectionList";
import { FormData } from "@/utils/category";
import React, { FunctionComponent } from "react";


export const isFormData = (item: FormData | HeaderTitle): item is FormData => {
  return (item as FormData).id !== undefined;
};

const Item: FunctionComponent<{ item: FormData | HeaderTitle }> = ({ item }) => {
  // const iconName = useTimeElapseAnimation()
  return <NativeItem item={item} />
}

export default React.memo(Item)