import Image from "next/image";

export function NameTransition() {
  return (
    <h1 className="font-medium pt-12 transition-element">
      <span className="sr-only">Federico Gerardi </span>
      <span aria-hidden="true" className="block overflow-hidden group relative">
        <span className="inline-block transition-all duration-300 ease-in-out group-hover:-translate-y-full whitespace-nowrap">
          {'Federico Gerardi'.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{ transitionDelay: `${index * 25}ms` }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span> 
          ))}<Image src={"/ppw.png"} alt="emoji" className="inline-block relative left-0.5 bottom-1" width={25} height={25} />
        </span>
        <span className="inline-block absolute left-0 top-0 transition-all duration-300 ease-in-out translate-y-full group-hover:translate-y-0">
          {'fegerar'.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{ transitionDelay: `${index * 25}ms` }}
            >
              {letter}
            </span>
          ))} <Image src={"/lupetto.svg"} alt="emoji" className="relative bottom-0.5 inline-block" width={20} height={20} />
        </span>
      </span>
    </h1>
  );
}
