import { FiX } from 'react-icons/fi';

export default function HoverText(props: any) {
  const hasSelection = props.selections && props.selections.length >= 1;
  const hoverText = props.hoverText?.trim().length > 0 ? props.hoverText : '';
  const isHoveringSelected = hasSelection && hoverText === props.label;
  const showSelectedAffordance =
    hasSelection && (!hoverText || isHoveringSelected);

  let ret = null;

  if (!showSelectedAffordance) {
    ret = (
      <div className="flex h-6 items-center justify-center gap-2">
        <div className="flex items-center justify-center rounded-full bg-[#8ec8cc] p-0.5 opacity-0">
          <FiX className="stroke-white" size={12} />
        </div>
        <div>{hoverText || ' '}</div>
      </div>
    );
  } else {
    ret = (
      <button
        className="group flex h-6 w-full items-center justify-center gap-2"
        onClick={props.dropCallback}
        type="button"
      >
        <div className="flex items-center justify-center rounded-full bg-[#8ec8cc] p-0.5 group-hover:opacity-75">
          <FiX className="stroke-white" size={12} />
        </div>
        <div>{props.label || ' '}</div>
      </button>
    );
  }

  return (
    <div className="py-3 text-center font-sans text-sm text-[#6e6e6e]">
      {ret}
    </div>
  );
}
