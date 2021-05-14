import data from "../../vendor/data.json"

export default ({ query: { name } }, res) => {
    const _find = data.data.filter(x => x.store_name.toLowerCase().indexOf(name.toLowerCase()) >= 0)

    if(_find.length > 0) {
        res.status(200).json({ code: 200, now: _find })
    } else {
        res.status(404).json({ code: 404 })
    }
}