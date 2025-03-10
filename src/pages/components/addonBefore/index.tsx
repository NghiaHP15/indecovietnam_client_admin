interface PropKey {
  label: string,
  required: boolean,
  width: number
}
function AddonBefore({label, required, width}: PropKey) {
  return (
    <div className='text-sm flex items-center' style={{width: width}}>
      <span>{label}</span>
      {required && <span className='ml-1' style={{color: 'red'}}>*</span>}
    </div>
  );
}

export default AddonBefore;