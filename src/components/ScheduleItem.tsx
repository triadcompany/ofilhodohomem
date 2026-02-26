interface ScheduleItemProps {
  day: string;
  time: string;
  event: string;
  isHighlight?: boolean;
}

const ScheduleItem = ({ day, time, event, isHighlight }: ScheduleItemProps) => {
  return (
    <div
      className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:translate-x-1 ${
        isHighlight
          ? "bg-accent/10 border border-accent/30 shadow-sm"
          : "bg-card border border-border/50 hover:border-accent/20 hover:shadow-card"
      }`}
    >
      <div className="w-16 text-center shrink-0">
        <span
          className={`font-display text-sm font-semibold ${
            isHighlight ? "text-accent" : "text-primary"
          }`}
        >
          {day}
        </span>
      </div>
      <div className={`w-px h-10 transition-colors ${isHighlight ? "bg-accent/40" : "bg-border group-hover:bg-accent/30"}`} />
      <div className="flex-1 min-w-0">
        <p className="font-body text-foreground font-medium truncate">{event}</p>
        <p className="font-ui text-sm text-muted-foreground">{time}</p>
      </div>
      {isHighlight && (
        <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-ui font-medium rounded-full animate-pulse shrink-0">
          Hoje
        </span>
      )}
    </div>
  );
};

export default ScheduleItem;
