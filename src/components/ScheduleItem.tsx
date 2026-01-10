interface ScheduleItemProps {
  day: string;
  time: string;
  event: string;
  isHighlight?: boolean;
}

const ScheduleItem = ({ day, time, event, isHighlight }: ScheduleItemProps) => {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
        isHighlight
          ? "bg-accent/10 border border-accent/30"
          : "bg-card border border-border/50 hover:border-accent/20"
      }`}
    >
      <div className="w-16 text-center">
        <span
          className={`font-display text-sm font-semibold ${
            isHighlight ? "text-accent" : "text-primary"
          }`}
        >
          {day}
        </span>
      </div>
      <div className="w-px h-10 bg-border" />
      <div className="flex-1">
        <p className="font-body text-foreground font-medium">{event}</p>
        <p className="font-ui text-sm text-muted-foreground">{time}</p>
      </div>
      {isHighlight && (
        <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-ui font-medium rounded-full">
          Hoje
        </span>
      )}
    </div>
  );
};

export default ScheduleItem;
