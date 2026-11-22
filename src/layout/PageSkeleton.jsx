// A full-page skeleton while the dashboard checks who you are and whether it's open
// (update v5, file 01 §2): the frame of the page, so nothing of the wrong page flashes.
export function PageSkeleton({ label = 'Loading' }) {
  return (
    <div className="b360 sk-page" role="status" aria-label={label} aria-busy="true">
      <div className="b360-glows" aria-hidden="true">
        <span className="glow-a" />
        <span className="glow-b" />
      </div>
      <div className="b360-wrap" aria-hidden="true">
        <div className="b360-nav sk-nav">
          <span className="sk sk-logo" />
          <span className="sk sk-tabs" />
          <span className="sk sk-btn" />
        </div>
        <div className="b360-hello">
          <span className="sk sk-h1" />
          <span className="sk sk-h1 is-short" />
          <span className="sk sk-p" />
        </div>
        <div className="b360-panel sk-panel">
          <span className="sk sk-h2" />
          <div className="sk-cards">
            <span className="sk sk-card" />
            <span className="sk sk-card" />
            <span className="sk sk-card" />
          </div>
        </div>
      </div>
    </div>
  );
}
