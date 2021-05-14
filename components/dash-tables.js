import { format, add } from "date-fns";
import MUIDataTable from "mui-datatables";

export default function DashTable({ resData }) {
    const columns = [{
        name: "store_name",
        label: "Store Name",
    }, {
        name: "categories",
        label: "Type",
    }, {
        name: "store_phone",
        label: "Phone Number",
    }, {
        name: "store_location",
        label: "Address",
        options: {
            sort: false,
            filter: false,
            viewColumns: false,
            customBodyRender: (value) => {
                const lat = value.latitude
                const long = value.longitude
                const link = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`

                return (
                    <a href={link} target="_blank">
                        <img width={30} src="https://miro.medium.com/max/1024/0*oJK4t4_NTgdBPPgz.png" alt="Google Maps" />
                    </a>
                )
            }
        }
    }, {
        name: "registered",
        label: "Date Register",
        options: {
            customBodyRender: (value) => {
                return <p>{value}</p>
            }
        }
    }];

    const options = {
        filter: true,
        filterType: "dropdown",
        responsive: "vertical",
        tableBodyHeight: "500px",
        download: false,
        print: false,
        search: false,
        selectableRows: 'none'
    };

    return (
        <MUIDataTable
            data={resData}
            columns={columns}
            options={options}
        />
      )
}