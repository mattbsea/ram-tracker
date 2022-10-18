import {
    Card,
    CardContent, Link,
    Stack,
    Typography
} from "@mui/material";
import { useGetOrderStatusQuery } from "../services/orderStatus";
import { UserInfoProps } from "./types";

export const DealerInfo = ({ name, von }: UserInfoProps) => {
  const orderStatus = useGetOrderStatusQuery({ name, von });

  if (orderStatus.isLoading) {
    return <p>Loading Dealer Info...</p>;
  }

  if (orderStatus.isError || !orderStatus.data) {
    return <p>Error getting Dealer Info</p>;
  }

  const { dealerDetails } = orderStatus.data;
  const {
    name: dealerName,
    address,
    city,
    state,
    zip,
    phoneNumber,
    lat: latitude,
    longitude,
    dealerWebsiteUrl,
  } = dealerDetails;

  const lat = parseInt(latitude) / 100000;
  const long = parseInt(longitude) / 100000;

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          <Link href={dealerWebsiteUrl}>{dealerName}</Link>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Stack>
            <div>
              Address:{" "}
              <Link href={`https://www.google.com/maps/@${lat},${long},14z`}>
                {address} {city}, {state} {zip}
              </Link>
            </div>
            <div>
              Phone:{" "}
              <Link href={`tel://${phoneNumber}`}>
                {phoneNumber.slice(0, 3)}-{phoneNumber.slice(3, 6)}-
                {phoneNumber.slice(6, 10)}
              </Link>
            </div>
          </Stack>
        </Typography>
      </CardContent>
    </Card>
  );
};
