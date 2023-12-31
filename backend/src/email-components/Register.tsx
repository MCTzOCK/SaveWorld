/**
 * backend/src/email-components/Register.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 31.12.2023
 *
 */

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function Register(props: { firstName: string; link: string }) {
  return (
    <Html>
      <Head />
      <Preview>Willkommen bei SaveWorld!</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`https://www.saveworld.one/logo.png`}
                alt="SaveWorld"
                width={60}
                height={57}
                className="my-0 mx-auto max-w-full max-h-full"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Registrierung <strong>abschließen</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hallo, {props.firstName}!
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Vielen Dank für deine Registrierung bei SaveWorld. Wir freuen uns,
              dich bei uns begrüßen zu dürfen.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Klicke auf den Knopf unten, um deine Registrierung abzuschließen.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-4 py-2"
                href={props.link}
              >
                Abschließen
              </Button>
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
              Sollte der Knopf nicht funktionieren, kopiere bitte folgenden Link
              in deinen Browser:
              <br />
              <Link
                className="text-[#0070f3] hover:underline"
                href={props.link}
              >
                {props.link}
              </Link>
            </Text>

            <Text className="text-black text-[14px] leading-[24px]">
              Liebe Grüße aus Hattingen,
              <br />
              Ben von SaveWorld
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
