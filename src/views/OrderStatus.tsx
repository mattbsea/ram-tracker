import { Container } from "@mui/system";
import { useLoaderData } from "react-router-dom";
import { EquipmentList } from "../componets/equipment";


export async function loader({ params }: any) {
  return params;
}

type OrderLoaderData = {
    name: string;
    von: number
}

export const OrderStatusView = () => {

    const params = useLoaderData() as OrderLoaderData;

    return (
      <>
        <Container sx={{ width: "75%", height: "100vh"}}>
          <EquipmentList name={params.name} von={params.von} />
        </Container>
      </>
    );
}
