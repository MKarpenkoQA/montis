import { Eyebrow } from "./Eyebrow";
import { RevealLines } from "./RevealLines";

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export const SectionIntro = ({
  eyebrow,
  title,
  description,
  eyebrowClassName = "",
  titleClassName = "",
  descriptionClassName = "",
}: SectionIntroProps) => (
  <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-end">
    <div className="md:col-span-7">
      <Eyebrow className={eyebrowClassName}>{eyebrow}</Eyebrow>
      <RevealLines as="h2" className={titleClassName} text={title} />
    </div>
    <p className={`md:col-span-5 leading-relaxed ${descriptionClassName}`}>{description}</p>
  </div>
);
