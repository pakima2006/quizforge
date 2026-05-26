export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-forge-muted/50 border border-forge-border flex items-center justify-center mb-5">
          <Icon size={28} className="text-forge-text-dim" />
        </div>
      )}
      <h3 className="font-display font-semibold text-lg text-forge-text mb-2">{title}</h3>
      {description && (
        <p className="text-forge-text-muted font-body text-sm max-w-xs mb-6">{description}</p>
      )}
      {action}
    </div>
  )
}
