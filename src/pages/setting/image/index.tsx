import { useEffect, useState } from "react";
import Region, { RegionCenter } from "@/layouts/_common/Region";
import { Checkbox, Flex, Image, Select, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useThemeToken } from "@/theme/hooks";
import _ from "lodash";
import { deleteImages, internalImages } from "@/api/services/imageService";
import Masonry from "react-masonry-css";
import { bg_image } from "@/assets/images";
import ButtonIcon from "@/components/ButtonIcon";
import { SORT_IMAGE } from "#/enum";

const ImageLayout = () => {
  const { t } = useTranslation ();
  const { colorBgContainer, colorBorder, colorBgElevated } = useThemeToken();
  const [data, setData] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [sort, setSort] = useState(SORT_IMAGE.CREATE_AT_ASC);
  
  useEffect(() => {
    // Fetch image settings data here and set it to state
    const fetchData = async () => {
      try {
        // Replace with actual data fetching logic
        const res = await internalImages({sort});
        setData(res || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(); 
  }, [sort]);

  const breakpointColumnsObj = {
    default: 5,
    1100: 3,
    700: 1,
  };

  const onSelectImage = (image: any, e: boolean) => {
    let newSelectedImages = _.cloneDeep(selectedImages);
    if (e) {
      newSelectedImages.push(image.public_id);
    } else {
      newSelectedImages = newSelectedImages.filter(item => item !== image.public_id);
    }
    setSelectedImages(newSelectedImages);
  }

  const onChangeSort = (value: string) => {
    setSort(value);
  }

  const onDeleteImages = async () => {
    try {
       await deleteImages(selectedImages);
    } catch (error) {
      console.error("Error deleting images:", error);
    }
    setSelectedImages([]);
  }

  return (
    <Region>
      <RegionCenter>
        <div style={{ backgroundColor: colorBgContainer, padding: 20 }} className="rounded-lg overflow-auto h-full">
          <Flex justify="space-between" align="center" className="mb-5 p-3 rounded-md" style={{ backgroundColor: colorBgElevated }}>
            <div></div>
            <Space>
              <ButtonIcon typeIcon="delete" disabled={selectedImages.length === 0} style={{ height: 32, width: 32 }} onClick={onDeleteImages}>{t('common.delete')}</ButtonIcon>
              <Select placeholder="Sắp xếp theo ngày..." onChange={onChangeSort} options={SORT_IMAGE.list.map(item => ({ value: item.value, label: t(item.label) })) || []} style={{ width: 180 }}/>
            </Space>
          </Flex>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto gap-2"
            columnClassName="bg-clip-padding"
          >
            {data.map(item => (
              <div key={item.public_id} className="break-inside-avoid relative group" >
                <Image src={item.url} alt={item.public_id} width={'100%'} height={'auto'} style={{border: `1px solid ${colorBorder}`, backgroundImage: `url(${bg_image})`, backgroundRepeat: 'repeat'}} />
                <div className="absolute top-2 right-2 none group-hover:block">
                  <Checkbox onChange={(e) => onSelectImage(item, e.target.checked)} />
                </div>
              </div>
            ))}
          </Masonry>
        </div>
      </RegionCenter>
    </Region>
  );
};

export default ImageLayout;
