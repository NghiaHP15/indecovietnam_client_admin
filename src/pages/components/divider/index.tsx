import { useThemeToken } from "@/theme/hooks";
import Color from "color";

interface Props {
  label: string;
}
function Divider({ label }: Props) {

  const { colorPrimary } = useThemeToken()
  return ( 
    <div className="bg-red-100 p-2 mb-3 boder border-l-2 solid rounded" style={{ background: Color(colorPrimary).alpha(0.15).string(), borderColor: colorPrimary }}>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default Divider;