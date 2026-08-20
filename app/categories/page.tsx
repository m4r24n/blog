const categories = [
  ['Journal', 'Personal notes, observations and whatever feels worth writing down.'],
  ['Projects', 'Things I am building, testing, fixing or learning through making.'],
  ['Photography', 'Photographs and the stories or details around them.'],
  ['Places', 'Travel notes, walks, trains and places I want to remember.'],
  ['Learning', 'Ideas, books, technical notes and things I recently understood.'],
  ['Work', 'Selected professional notes and updates from ongoing work.']
];

export default function Categories() {
  return <>
    <div className="kicker">Browse</div>
    <h1 className="page-title">Loose shelves, not strict boxes.</h1>
    <p className="page-intro">Categories are there when they help someone explore, not to force every post into a rigid format. A note can simply live where it feels most natural.</p>
    <div className="cards">
      {categories.map(([name, description]) => <div className="card" key={name}>
        <div className="meta">Category</div>
        <h2>{name}</h2>
        <p>{description}</p>
      </div>)}
    </div>
  </>;
}
