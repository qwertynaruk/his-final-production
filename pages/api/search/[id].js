import data from "../vendor/data.json"

export default ({ query: { id } }, res) => {
    const filtered = data.filter((p) => p.vendor_id === id)

    if (filtered.length > 0) {
        res.status(200).json(filtered[0])
    } else {
        res.status(404).json({ message: `Vendor with id: ${id} not found.` })
    }
}