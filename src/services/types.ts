type OrderState = {
    statusCode: string;
    statusDesc: string;
    arrivalDate: string;
    statusUpdateDate: string;
    display: string;
    currentStatus: string;
    order: string;
}

type VinDetails = {
    brandName: string;
    modelName: string;
    modelYear: string;
    vin: string;
    von: string;
    paintSalescode: string;
    bodyModelCode: string;
    cllp: string;
    image: string;
}

type DealerDetails = {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phoneNumber: string;
    lat: string;
    longitude: string;
    dealerWebsiteUrl: string;
}

export type OrderStatusResult = {
    statusCode: string;
    orderstatus: [OrderState];
    vinDetails: VinDetails;
    dealerDetails: DealerDetails;
}

export type OrderStatusQuery = {
    name: string;
    von: number;
}
