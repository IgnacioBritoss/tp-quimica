export interface Tip {
  title: string;
  body: string;
}

export interface Myth {
  myth: string;
  truth: string;
}

export const TIPS: Tip[] = [
  {
    title: "Comer antes y durante",
    body: "Si tomas con el estomago lleno, el alcohol se absorbe mas lento y el pico de alcoholemia es mas bajo. Las comidas con grasas y proteinas ayudan a demorar la absorcion.",
  },
  {
    title: "Tomar agua entre trago y trago",
    body: "Intercalar agua reduce la cantidad total de alcohol que ingeris y ayuda con la deshidratacion, que es una de las causas del malestar del dia despues.",
  },
  {
    title: "El tiempo es lo unico que baja la alcoholemia",
    body: "El cuerpo elimina alrededor de 0,15 g/L por hora y no hay forma de acelerarlo. Ni el cafe, ni la ducha fria, ni vomitar bajan la alcoholemia: solo esperar.",
  },
  {
    title: "Si tomaste, no manejes",
    body: "En Argentina rige el alcohol cero al volante: el limite es 0,0 g/L. Organiza la vuelta antes de salir: conductor designado, remis, transporte o quedarte a dormir.",
  },
  {
    title: "Cuidado al mezclar con energizantes",
    body: "Las bebidas con cafeina son estimulantes y pueden enmascarar la sensacion de borrachera, haciendo que sigas tomando sin notar cuanto subiste. La alcoholemia sube igual.",
  },
  {
    title: "Conoce tus limites",
    body: "El mismo trago afecta distinto segun el peso, el sexo y la contextura. Las personas mas livianas y con menor proporcion de agua corporal alcanzan alcoholemias mas altas con la misma cantidad.",
  },
];

export const MYTHS: Myth[] = [
  {
    myth: "El cafe te baja la borrachera.",
    truth: "Falso. El cafe es un estimulante que te puede mantener despierto, pero no reduce la alcoholemia. El higado sigue eliminando el alcohol al mismo ritmo.",
  },
  {
    myth: "Una ducha fria te despeja el alcohol.",
    truth: "Falso. Solo cambia la sensacion momentanea. La cantidad de alcohol en sangre sigue igual.",
  },
  {
    myth: "Si comes mucho, no te afecta el alcohol.",
    truth: "Parcial. Comer demora la absorcion y baja el pico, pero no evita que el alcohol pase a la sangre. Termina afectando igual.",
  },
  {
    myth: "El alcohol da calor.",
    truth: "Falso. Da sensacion de calor porque dilata los vasos de la piel, pero en realidad el cuerpo pierde temperatura mas rapido.",
  },
  {
    myth: "La cerveza no emborracha como los destilados.",
    truth: "Falso. Lo que importa son los gramos de alcohol totales. Varias cervezas pueden aportar tanto alcohol como unos tragos fuertes.",
  },
  {
    myth: "Vomitar te baja la alcoholemia.",
    truth: "Falso. El alcohol se absorbe rapido; gran parte ya paso a la sangre. Vomitar no revierte lo que ya se absorbio.",
  },
  {
    myth: "Aguantar bien el alcohol significa que no te hace mal.",
    truth: "Falso. La tolerancia cambia la sensacion, pero la alcoholemia y el dano a los organos son los mismos. Podes estar por encima del limite sin sentirte borracho.",
  },
];
