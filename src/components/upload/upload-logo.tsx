import { Upload } from 'antd';
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';
import { useState } from 'react';
import { Iconify } from '../icon';

import { StyledUploadAvatar } from './styles';
import { beforeAvatarUpload, getBlobUrl } from './utils';

interface Props extends UploadProps {
  defaultLogo?: string;
  helperText?: React.ReactElement | string;
}
export function UploadLogo({ helperText, defaultLogo = '', ...other }: Props) {
  const [imageUrl, setImageUrl] = useState<string>(defaultLogo);

  const [isHover, setIsHover] = useState(false);
  const handelHover = (hover: boolean) => {
    setIsHover(hover);
  };

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (['done', 'error'].includes(info.file.status!)) {
      // TODO: Get this url from response in real world.
      setImageUrl(getBlobUrl(info.file.originFileObj!));
    }
  };

  const renderPreview = <img src={imageUrl} alt="" className="absolute rounded-md" />;

  const renderPlaceholder = (
    <div
      style={{
        backgroundColor: !imageUrl || isHover ? 'rgba(22, 28, 36, 0.25)' : 'transparent',
        color: '#fff',
      }}
      className="absolute z-10 flex h-full w-full flex-col items-center justify-center"
    >
      <Iconify icon="solar:camera-add-bold" size={32} />
      <div className="mt-1 text-xs">Upload Photo</div>
    </div>
  );

  const renderContent = (
      <div
        className="relative p-2 border solid border-gray-300 inset-0 flex h-full w-full items-center rounded-lg"
      >
        <div
          className='relative inset-0 flex h-full w-full items-center justify-center overflow-hidden rounded-md'
          onMouseEnter={() => handelHover(true)}
          onMouseLeave={() => handelHover(false)}
        >
          {imageUrl ? renderPreview : null}
          {!imageUrl || isHover ? renderPlaceholder : null}
        </div>
      </div>
  );

  return (
    <StyledUploadAvatar>
      <Upload
        name="logo"
        showUploadList={false}
        listType="picture-card"
        className="logo-uploader "
        {...other}
        beforeUpload={beforeAvatarUpload}
        onChange={handleChange}
      >
        {renderContent}
      </Upload>
    </StyledUploadAvatar>
  );
}
