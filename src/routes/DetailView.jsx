import CoinDetail from '../Components/CoinDetail'

function DetailView() {
  return (
    <div>
      {/* Keep the route component thin: its main job is to mount the detail component. */}
      <CoinDetail />
    </div>
  )
}

export default DetailView
