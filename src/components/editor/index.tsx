/* eslint-disable import/order */
import '@/utils/highlight';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import { formats } from './toolbar';
import { useSettings } from '@/store/settingStore';
import { useThemeToken } from '@/theme/hooks';
import { StyledEditor } from './styles';

interface Props extends ReactQuillProps {
  sample?: boolean;
}
export default function Editor({ id = 'slash-quill', sample = false, ...other }: Props) {
  const token = useThemeToken();
  const { themeMode } = useSettings();
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };
  return (
    <StyledEditor $token={token} $thememode={themeMode}>
      <ReactQuill
        className='rounded-md'
        formats={formats}
        modules={modules}
        {...other}
        placeholder=""
      />
    </StyledEditor>
  );
}
