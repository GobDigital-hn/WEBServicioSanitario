import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
  Img,
  Tailwind,
} from '@react-email/components';

const CertificateEmail = (props) => {
  const {
    userName = 'Usuario',
    certificateNumber = 'PF010-2025-000000',
    supportEmail = 'soporte@arsa.hn',
  } = props;

  return (
    <Html lang="es" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white mx-auto px-[40px] py-[40px] rounded-[8px] shadow-sm max-w-[600px]">
            {/* Header con Logo ARSA */}
            <Section className="text-center mb-[32px]">
              <div className="mb-[16px]">
                <Img
                  src="https://arsa.hn/LogoArsa.png"
                  alt="ARSA Logo"
                  width="120"
                  height="auto"
                  className="mx-auto"
                />
              </div>
              <Heading className="text-[28px] font-bold text-gray-900 m-0">
                ¡Certificado Generado Exitosamente!
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 mb-[16px]">
                Estimado/a {userName},
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[16px] leading-[24px]">
                Nos complace informarle que su <strong>Certificado de Registro Sanitario</strong> ha sido generado correctamente en nuestra plataforma.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[16px] leading-[24px]">
                Su certificado con número de registro <strong>{certificateNumber}</strong> ya está disponible y adjunto en este correo electrónico. Este documento certifica oficialmente el registro sanitario de su producto y puede ser utilizado para fines comerciales y legales.
              </Text>

              <div className="bg-blue-50 border border-blue-200 rounded-[8px] p-[20px] mb-[24px]">
                <Text className="text-[14px] text-blue-800 m-0 font-medium">
                  💡 <strong>Importante:</strong> Le recomendamos guardar una copia de su certificado en un lugar seguro. Este documento es válido por 2 años desde la fecha de emisión.
                </Text>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-[8px] p-[20px] mb-[24px]">
                <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                  <strong>Número de Registro:</strong> {certificateNumber}
                </Text>
                <Text className="text-[14px] text-gray-700 m-0">
                  <strong>Fecha de Emisión:</strong> {new Date().toLocaleDateString('es-HN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </div>
            </Section>

            <Hr className="border-gray-200 my-[32px]" />

            {/* Support Section */}
            <Section className="mb-[32px]">
              <Heading className="text-[20px] font-semibold text-gray-900 mb-[16px]">
                ¿Necesita Ayuda?
              </Heading>

              <Text className="text-[16px] text-gray-700 mb-[16px] leading-[24px]">
                Si tiene alguna duda sobre su certificado o necesita asistencia técnica, no dude en contactarnos. Nuestro equipo de soporte está aquí para ayudarle.
              </Text>

              <div className="bg-gray-50 border border-gray-200 rounded-[8px] p-[20px]">
                <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                  📧 <strong>Email de soporte:</strong> {supportEmail}
                </Text>
                <Text className="text-[14px] text-gray-700 m-0">
                  ⏰ <strong>Horario de atención:</strong> Lunes a Viernes, 8:00 AM - 5:00 PM
                </Text>
              </div>
            </Section>

            <Hr className="border-gray-200 my-[32px]" />

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-[14px] text-gray-500 mb-[8px]">
                Gracias por confiar en ARSA - Agencia de Regulación Sanitaria.
              </Text>

              <Text className="text-[12px] text-gray-400 m-0">
                © {new Date().getFullYear()} ARSA. Todos los derechos reservados.
              </Text>

              <Text className="text-[12px] text-gray-400 m-0 mt-[8px]">
                Tegucigalpa, Honduras
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

CertificateEmail.PreviewProps = {
  userName: 'María González',
  certificateNumber: 'PF010-2025-001234',
  supportEmail: 'soporte@arsa.hn',
};

export default CertificateEmail;

