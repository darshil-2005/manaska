export default function CoordinatesDisplay({coordinates}) {
  
  const x = Math.round(coordinates[0]);
  const y = Math.round(coordinates[1]);

  return (
    <div className="border bg-muted text-md px-4 h-10 flex justify-center items-center rounded-lg tracking-widest text-nowrap">
    {x} | {y}
    </div>
  )
} 
