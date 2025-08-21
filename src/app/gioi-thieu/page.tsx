"use client";
import * as React from "react";

const Hero: React.FC = () => {
  return (
    <section className="mt-10 w-full max-w-[1420px] self-center max-md:max-w-full">
      <div className="my-auto w-[700px] min-w-60 self-stretch">
        <h1 className="text-4xl font-black uppercase text-[#D4AF37]">
          Về chúng tôi
        </h1>
        <p className="mt-4 text-lg font-light text-black max-md:max-w-full">
          Moo Beef Steak – Thưởng thức bít tết thượng hạng từ Wagyu, Black
          Angus, bò Mỹ USDA Choice. Thành lập 2008, chuẩn vị Âu – Mỹ, tinh tế
          cho người Việt.
        </p>
      </div>
    </section>
  );
};

const WhoWeAre: React.FC = () => {
  return (
    <section className="flex w-full max-w-[1420px] flex-col px-0 max-md:px-4 md:px-0">
      <div className="flex w-full flex-col justify-center py-10 rounded-[8px] max-md:max-w-full max-md:px-4">
        <img
          src="images/banner/488484239_1078791174289473_5661999922563937715_n.jpg"
          className=" w-full rounded-[8px] object-contain max-md:max-w-full"
          alt="Restaurant interior"
        />
      </div>
      <h2 className="min-h-[120px] w-full max-w-[1419px] self-stretch py-2.5 text-center text-6xl font-bold text-black max-md:max-w-full max-md:text-4xl">
        <span style={{ fontSize: "72px", color: "rgba(212,175,55,1)" }}>
          WHO
        </span>{" "}
        <span style={{ fontSize: "58px", color: "rgba(46,79,52,1)" }}>
          WE ARE
        </span>
      </h2>
      <div className="flex w-full max-w-[1420px] flex-row items-stretch justify-between py-10 text-black gap-10 max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-6">
        <div className="flex-1 min-w-[340px] max-w-[50%] flex items-center justify-center text-3xl max-md:max-w-full max-md:w-full max-md:text-lg max-md:text-center">
          <p className="w-full text-justify max-md:text-center">
            Moo Beef Steak mang đến bữa ăn chất lượng với bít tết nghệ thuật từ nguyên liệu cao cấp Mỹ, Úc, Nhật, sốt độc đáo như tiêu đen, nấm porcini, gan ngỗng. Không gian sang trọng, ấm cúng, lý tưởng cho hẹn hò, gặp đối tác, sum họp gia đình. Mọi chi tiết, từ bày trí đến dịch vụ, đều tinh tế, tạo trải nghiệm khó quên.
          </p>
        </div>
        <div className="flex-1 min-w-[340px] max-w-[50%] flex flex-col gap-10 items-center justify-center text-xl max-md:max-w-full max-md:w-full max-md:pl-0">
          <div className="flex w-full items-center gap-4 rounded-md border border-dotted p-4 max-md:justify-center max-md:text-center max-md:text-lg">
            <img src="/globe.svg" alt="icon" className="mt-1 h-10 w-10" />
            <p className="w-full text-justify max-md:text-center">
              Thịt bò Wagyu, Black Angus, và bò Mỹ USDA Choice nhập khẩu từ Tyson, Omaha (Mỹ), Mulwarra (Úc), đảm bảo độ tươi ngon và chất lượng đỉnh cao.
            </p>
          </div>
          <div className="flex w-full items-center gap-4 rounded-md border border-dotted p-4 max-md:justify-center max-md:text-center max-md:text-lg">
            <img src="/window.svg" alt="icon" className="mt-1 h-10 w-10" />
            <p className="w-full text-justify max-md:text-center">
              Không gian đẳng cấp Phong cách châu Âu kết hợp nét phóng khoáng miền Tây Mỹ, với nội thất nâu trầm, ghế da, đèn chùm tinh xảo, và quầy rượu vang sang trọng.
            </p>
          </div>
          <div className="flex w-full items-center gap-4 rounded-md border border-dotted p-4 max-md:justify-center max-md:text-center max-md:text-lg">
            <img src="/file.svg" alt="icon" className="mt-1 h-10 w-10" />
            <p className="w-full text-justify max-md:text-center">
              Dịch vụ chuyên nghiệp Đội ngũ nhân viên được đào tạo bài bản, chú trọng từng chi tiết như sắp xếp dao dĩa, tư vấn món ăn, và phục vụ đúng yêu cầu khách hàng.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <article className="my-auto flex min-h-[604px] w-[368px] min-w-60 shrink grow flex-col items-center self-stretch rounded-xl bg-yellow-50 px-10 shadow-[4px_4px_12px_rgba(0,0,0,0.25)] max-md:max-w-full max-md:px-5">
      <div className="flex min-h-4 w-[368px] max-w-full rounded-sm bg-zinc-300" />
      <h3 className="mt-20 font-bold max-md:mt-10">{title}</h3>
      <p className="mt-20 max-md:mt-10">{description}</p>
      <div className="mt-auto flex min-h-4 w-[368px] max-w-full rounded-sm bg-zinc-300 max-md:mt-10" />
    </article>
  );
};

const FeatureCards: React.FC = () => {
  const features = [
    {
      title: "Bít tết chuẩn vị Âu – Mỹ",
      description:
        "Tận hưởng các món bít tết từ sườn bò Mỹ rút xương, thăn vai Black Angus, đến cá hồi nướng sốt bơ chanh, với độ chín tùy chọn và sốt độc quyền như sốt vang đỏ hay gan ngỗng.",
    },
    {
      title: "Không gian lý tưởng cho mọi dịp",
      description:
        "Thiết kế sang trọng nhưng ấm cúng, phù hợp cho hẹn hò lãng mạn, gặp gỡ đối tác, hoặc tiệc gia đình. Một số chi nhánh có phòng VIP riêng tư và quầy bar đẳng cấp.",
    },
    {
      title: "Ưu đãi hấp dẫn",
      description:
        "Thưởng thức bít tết giảm 50% vào thứ Hai hàng tuần hoặc ưu đãi 10% khi đặt bàn qua PasGo, mang đến trải nghiệm ẩm thực cao cấp với chi phí hợp lý.",
    },
  ];

  return (
    <section className="flex w-full max-w-[1420px] flex-wrap items-center gap-5 py-10 text-center text-2xl text-black max-md:max-w-full max-md:px-4">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </section>
  );
};

const ImageTextSection: React.FC = () => {
  return (
    <section className="flex flex-wrap items-center py-10 text-2xl text-black max-md:max-w-full max-md:px-4">
      <img
        src="images/banner/498660826_4071724936432383_3315908774762315777_n.jpg"
        className="my-auto  w-[600px] min-w-60 self-stretch rounded-xl object-contain max-md:max-w-full"
        alt="Restaurant scene"
      />
      <div className="my-auto min-h-[400px] w-[720px] min-w-60 gap-2.5 self-stretch px-32 py-20 text-justify max-md:max-w-full max-md:px-5">
        Moo Beef Steak không chỉ là nơi thưởng thức ẩm thực, mà còn là hành
        trình khám phá hương vị đỉnh cao và sự tinh tế trong từng chi tiết. Với
        6 chi nhánh tại Hà Nội và TP. Hồ Chí Minh, chúng tôi sẵn sàng chào đón
        bạn để trải nghiệm những bữa ăn đáng nhớ. Hãy đến và cảm nhận sự khác
        biệt tại Moo Beef Steak – nơi đam mê ẩm thực hội tụ!
      </div>
    </section>
  );
};

function About() {
  return (
    <div className="flex flex-col items-center overflow-hidden bg-stone-100">
      <Hero />
      <WhoWeAre />
      <FeatureCards />
      <div className="flex w-full max-w-[1420px] flex-col justify-center py-10 max-md:max-w-full max-md:px-4">
        <img
          src="images/banner/484652319_1064959242339333_5779431903173814139_n.jpg"
          className="w-full rounded-[8px] object-contain max-md:max-w-full"
          alt="Restaurant interior"
        />
      </div>
      <ImageTextSection />
    </div>
  );
}

export default About;
