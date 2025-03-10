export const TemplateView = ({ data, id, selected, onSelect }: { data: any, id: number, selected: boolean, onSelect: (i: number) => void }) => {

  const onSelectItem = () => {
    onSelect(id)
  }

  const renderTr = (tds: any, index: number) => {
    return <tr key={index}>
      {tds.map(renderTd)}
    </tr>
  }

  const renderTd = (selectedColor: any, index: number) => {
    return <td key={index} className={`border border-solid border-[#ffffff] ${selectedColor}`}></td>
  }

  const content = () => {
    let selectedColor = selected ? "border-selected" : ""
    let contentItems = []
    for (let j = 0; j < data.value.y; j++) {
      let tds = []
      for (let i = 0; i < data.value.x; i++) {
        tds.push(selectedColor)
      }
      contentItems.push(tds)
    }
    
    return <table className={`w-full h-20 cursor-pointer border border-double border-[#ffffff] ${selectedColor}`} onClick={onSelectItem}>
      {contentItems.map(renderTr)}
    </table>
  }
  return content()
}