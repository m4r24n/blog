export default function Now() {
  return <>
    <div className="kicker">Now · August 2026</div>
    <h1 className="page-title">What has my attention.</h1>
    <p className="page-intro">A temporary snapshot rather than a permanent biography. I’ll change this page whenever the focus shifts.</p>

    <div className="now-grid">
      <div className="now-label">Building</div>
      <p>Setting up this blog and making space for smaller experiments, project notes and unfinished work.</p>
    </div>
    <div className="now-grid">
      <div className="now-label">Writing</div>
      <p>Trying to publish while ideas are still alive instead of waiting until every sentence feels final.</p>
    </div>
    <div className="now-grid">
      <div className="now-label">Elsewhere</div>
      <p>Collecting photographs, train-window details and notes from trips worth remembering.</p>
    </div>
  </>;
}
