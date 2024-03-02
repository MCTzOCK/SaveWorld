/**
 * mobile/src/pages/fooddata/FoodData.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2024 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 02.03.2024
 *
 */

import * as React from "react";
import { useRedirectForAnon } from "../../hooks/useRedirectForAnon";
import Page from "../../components/Page";
import { $$ } from "../../translations/i18n";
import { useIonRouter } from "@ionic/react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaBarcode } from "react-icons/fa6";
import DividerWithText from "../../components/DividerWithText";
import MobileBox from "../../components/MobileBox";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
import { useEffect } from "react";

export default function FoodData() {
  useRedirectForAnon();

  const [barcodeSupported, setBarcodeSupported] = React.useState(false);

  useEffect(() => {
    BarcodeScanner.isSupported().then((supported) =>
      setBarcodeSupported(supported.supported),
    );
  }, []);

  const router = useIonRouter();

  const redirect = (sn: string) => {
    router.push("/fooddata/" + sn, "forward", "push");
  };

  return (
    <>
      <Page title={$$("pages.fooddata.title")}>
        <MobileBox>
          <Stack spacing={4}>
            <Text>{$$("pages.fooddata.description")}</Text>
            <Button
              variant={"brand"}
              leftIcon={<FaBarcode />}
              isDisabled={!barcodeSupported}
              onClick={async () => {
                await BarcodeScanner.requestPermissions();
                document
                  .querySelector("body")
                  ?.classList.add("barcode-scanner-active");

                const listener = await BarcodeScanner.addListener(
                  "barcodeScanned",
                  async (result) => {
                    await listener.remove();
                    document
                      .querySelector("body")
                      ?.classList.remove("barcode-scanner-active");
                    await BarcodeScanner.stopScan();
                    console.log(result.barcode.rawValue);
                    redirect(result.barcode.rawValue);
                  },
                );

                await BarcodeScanner.startScan();
              }}
            >
              {$$("pages.fooddata.barcode.scan")}
            </Button>
            <DividerWithText text={$$("control.or")} />
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const ean = (e.target as any).ean.value;

                if (!ean) return;
                if (!(ean.match(/^[0-9]+$/) && ean.length === 13)) return;

                redirect(ean);
              }}
            >
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>{$$("pages.fooddata.ean.number")}</FormLabel>
                  <Input
                    type={"number"}
                    inputMode={"numeric"}
                    placeholder={$$("pages.fooddata.ean.number")}
                    name={"ean"}
                  />
                </FormControl>
                <Button type={"submit"} variant={"brand"} colorScheme={"brand"}>
                  {$$("pages.fooddata.ean.submit")}
                </Button>
              </Stack>
            </form>
          </Stack>
        </MobileBox>
      </Page>
    </>
  );
}
