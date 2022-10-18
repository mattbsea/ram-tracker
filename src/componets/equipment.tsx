import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useState } from "react";

import { useGetOrderStatusQuery } from "../services/orderStatus";
import { UserInfoProps } from "./types";

const EquipmentDescriptions = require("../data/equipment_codes.json");

type IrisData = {
  client: string | null;
  market: string | null;
  brand: string | null;
  vehicle: string | null;
  paint: string | null;
  fabric: string | null;
  sa: string | null;
  equipment: string[];
};

const GetIrisData = (image: string): IrisData | null => {
    try {
        const url = new URL(image);
        const params = new URLSearchParams(url.search);

        const equipment = params.get('sa')?.split(',') || []

        return {
            client: params.get('client'),
            market: params.get('market'),
            brand: params.get('brand'),
            vehicle: params.get('vehicle'),
            paint: params.get('paint'),
            fabric: params.get('fabric'),
            sa: params.get('sa'),
            equipment: equipment
        }
    } catch(e) {
        return null;
    }
}

export const EquipmentList = ({name, von}: UserInfoProps) => {
    const orderStatus = useGetOrderStatusQuery({name,von});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    if(orderStatus.isLoading || !orderStatus.data) {
        return <div>Loading Order Status</div>
    }

    const iris = GetIrisData(orderStatus.data.vinDetails.image)

    if(! iris) {
        return <div>Bad equipment details {orderStatus.data.vinDetails.image}</div>
    }

    const rows = iris.equipment.filter((code) => EquipmentDescriptions[code] || EquipmentDescriptions[code.slice(0,-1)]);

    return (
      <>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <Typography variant="h4">Equipment Listing</Typography>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="equipment list">
              <TableHead>
                <TableRow>
                  <TableCell>Order Code</TableCell>
                  <TableCell>Order Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((code: string) => {
                    return (
                      <TableRow
                        key={code}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {code}
                        </TableCell>
                        <TableCell>
                          {EquipmentDescriptions[code] ||
                            EquipmentDescriptions[code.slice(0, -1)] ||
                            "Not Found"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {(page + 1) * rowsPerPage > rows.length ? (
                  <TableRow>
                    <TableCell>Unknown Codes</TableCell>
                    <TableCell>
                      {iris.equipment
                        .filter(
                          (code) =>
                            !EquipmentDescriptions[code] &&
                            !EquipmentDescriptions[code.slice(0, -1)]
                        )
                        .join(", ")}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100, 200]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </>
    );
}