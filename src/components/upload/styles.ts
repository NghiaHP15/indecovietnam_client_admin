import { GlobalToken } from 'antd';
import styled from 'styled-components';

export const StyledUpload = styled.div<{ $thumbnail?: boolean }>`
  .ant-upload {
    border: none !important;
  }
  .ant-upload-list {
    display: ${(props) => (props.$thumbnail ? 'flex' : 'block')};
    flex-wrap: wrap;
  }
`;

export const StyledUploadAvatar = styled.div`
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  .ant-upload,
  .ant-upload-select {
    border: none !important;
  }
`;

export const StyledUploadBox = styled.div`
  .ant-upload {
    border: none !important;
  }
  .ant-upload-list {
    display: none;
  }
`;

export const StyledUploadImage = styled.div<{ $token: GlobalToken, style: any }>`
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  .ant-upload {
    width: ${(props) => props.style.width} !important;
    height: ${(props) => props.style.height} !important;
  }
  .ant-upload,
  .ant-upload-select {
    border: none !important;
  }
  .custom-crop-modal .ant-modal-content {
    background: ${(props) => props.$token.colorBgContainer};
  }
`;
