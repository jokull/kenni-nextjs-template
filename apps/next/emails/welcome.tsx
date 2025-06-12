import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html lang="is">
    <Head />
    <Preview>
      Velkomin til Órslofs! Þú hefur skráð þig inn með öruggum hætti.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Heading style={h1}>Velkomin til Órslofs!</Heading>

          <Text style={text}>
            Halló <strong>{name}</strong>!
          </Text>

          <Text style={text}>
            Velkomin til Órslofs! Þú hefur skráð þig inn með öruggum hætti með
            Kenni rafrænum skilríkjum.
          </Text>

          <Text style={text}>Þú getur nú:</Text>

          <Section style={list}>
            <Text style={listItem}>• Nálgast þjónustur okkar</Text>
            <Text style={listItem}>• Uppfært þínar upplýsingar</Text>
            <Text style={listItem}>
              • Hafð samband við okkur ef þú þarft aðstoð
            </Text>
          </Section>

          <Text style={text}>
            Ef þú hefur spurningar, hafd samband við okkur á{" "}
            <Link href="mailto:info@solberg.is" style={link}>
              info@solberg.is
            </Link>
          </Text>

          <Text style={footer}>
            Bestu kveðjur,
            <br />
            <strong>Órslofs teymið</strong>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

WelcomeEmail.PreviewProps = {
  name: "Jón Jónsson",
} as WelcomeEmailProps;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const list = {
  margin: "0 0 16px",
};

const listItem = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 8px",
  paddingLeft: "16px",
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};

const footer = {
  color: "#666",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "32px 0 0",
};
