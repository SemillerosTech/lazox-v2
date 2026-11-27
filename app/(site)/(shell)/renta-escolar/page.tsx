import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/button-link";
import { WhatsAppInquiry } from "@/components/whatsapp-inquiry";
import { PageWhatsApp } from "@/lib/whatsapp-context";
import { WHATSAPP_RENTAL_MESSAGE } from "@/lib/whatsapp";
import { SCHOOL_ACCESS_ENABLED } from "@/lib/rental";

export const metadata: Metadata = { title: "La renta escolar" };

export default function RentalPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <PageWhatsApp message={WHATSAPP_RENTAL_MESSAGE} />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Renta escolar" }]} />
      <h1 className="mt-6 text-4xl font-extrabold text-brand-ink md:text-5xl">La renta escolar</h1>
      <p className="mt-6 text-lg leading-relaxed">
        La renta es por mes. Usted escoge el libro aquí, con la clave de su escuela, y paga el mes.
        El día de entrega de su escuela, el mismo cada mes, su hija o su hijo recibe el libro con
        preguntas para conversarlo en casa. Lo regresa el siguiente día de entrega, y ese mismo día
        recibe el que usted escoja después.
      </p>
      <p className="mt-4 text-lg leading-relaxed">
        Se hace solo donde la escuela, o un grupo de familias de esa escuela, la pide y firma un
        acuerdo con nosotros. Empezamos con pocas, para hacerlo bien.
      </p>
      <section className="mt-10 rounded-3xl bg-brand-yellow p-6 md:p-8">
        <h2 className="text-3xl font-extrabold">Pruébelo primero en casa</h2>
        <p className="mt-3 text-lg">
          Escoja un libro y descargue su guía, sin registro: son preguntas para conversarlo en casa
          después de leer.
        </p>
        <div className="mt-5">
          <ButtonLink href="/guias">Ver las guías</ButtonLink>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-3xl font-extrabold">
          ¿Le gustaría tenerla en la escuela de sus hijos?
        </h2>
        <p className="mt-3 text-lg">Cuéntenos de su escuela. Le contesta una persona.</p>
        <div className="mt-5">
          <WhatsAppInquiry
            message={WHATSAPP_RENTAL_MESSAGE}
            label="Cuéntenos por WhatsApp"
            showSampleReply={false}
          />
        </div>
        <p className="mt-5 text-lg">
          Le contestamos siempre. Si este ciclo no podemos llegar a su escuela, se lo decimos con
          claridad y queda apuntada para el siguiente.
        </p>
      </section>
      {SCHOOL_ACCESS_ENABLED && (
        <section className="mt-10 rounded-3xl border border-border p-6">
          <h2 className="text-2xl font-extrabold">¿Su escuela ya tiene renta escolar?</h2>
          <p className="mt-3">Entre con la clave que le dieron en su escuela.</p>
          <label className="mt-4 block font-bold" htmlFor="school-key">
            Clave de la escuela
          </label>
          <input id="school-key" disabled className="mt-2 rounded-xl border border-border p-3" />
          <button
            type="button"
            disabled
            className="ml-3 rounded-full border border-border px-5 py-3"
          >
            Entrar
          </button>
        </section>
      )}
    </div>
  );
}
