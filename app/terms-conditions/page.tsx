import React from 'react'
import Breadcrumb from '../components/Breadcrumb'

const TnCPages = [
    { name: "Terms and Conditions", href: "/terms-conditions", current: true },
  ];

const TnC = () => {
  return (
    <div className="bg-[#121212] text-white px-6 pt-20 pb-10 md:px-24">
      <div className="mt-6 lg:mt-16">
        {/* Breadcrumb */}
        <Breadcrumb pages={TnCPages} />

        {/* Content Section */}
        <div className="flex flex-col font-poppins text-left ">
          <h2 className="lg:text-[40px] text-3xl text-center font-extrabold mb-6 leading-snug text-white">
          Terms and Conditions
          </h2>

          <div className="text-[#F6F6F6]  text-lg leading-relaxed space-y-4">
            <p>
              Nunc urna adipiscing malesuada felis, id elit ullamcorper quis porta sollicitudin. Nam vitae ipsum odio vitae quis odio in tincidunt enim. Nam dui urna. viverra in tortor. ex efficitur. adipiscing convallis. Nam dui. massa In luctus amet,
            </p>
            <p>
              sollicitudin. Donec sapien Cras felis, tincidunt vehicula, tincidunt dignissim, varius vitae amet, fringilla ultrices ex tincidunt porta hendrerit dui. efficitur. ex tincidunt sodales. Vestibulum diam faucibus nec Ut quis lacus vehicula,
            </p>
            <p>
              Morbi odio turpis lobortis, Praesent placerat varius Morbi amet, risus tincidunt Ut sit diam tincidunt Donec placerat elit. ullamcorper placerat amet, Morbi Nunc faucibus quam Nunc sit Donec diam scelerisque Donec maximus odio non, Sed id
            </p>
            <p>
              dolor turpis non. nisl. dignissim, scelerisque quis dui venenatis scelerisque Ut at elementum vehicula, tincidunt In ac urna id orci libero, ac lacus placerat non turpis maximus eu sapien ullamcorper leo. placerat. ipsum ipsum Lorem dui
            </p>
            <p>
              Ut venenatis eget enim. Nullam gravida id scelerisque porta vitae at eget porta elit. elit. Nam risus odio vitae sit ac quam Sed Ut tortor. Cras faucibus nibh lacus non non amet, tincidunt efficitur. placerat eget amet, gravida vitae in
            </p>
            <p>
              Morbi venenatis Lorem Nunc Vestibulum ullamcorper Nam elementum fringilla dignissim, nisi odio vel consectetur sapien fringilla non, vitae diam Ut faucibus Nunc lorem. tortor. diam Morbi libero, sollicitudin. quis Nam Lorem ullamcorper ex
            </p>
            <p>
              Quisque orci In non libero, commodo nec placerat. at elit orci urna. Quisque dui Nunc Lorem vitae consectetur tincidunt Morbi elit non, non. Nam tortor. vel non id ipsum tincidunt quam ac placerat Sed libero, varius Nam vel tincidunt sed
            </p>
            <p>
              risus ipsum Donec sed placerat. odio ipsum Ut urna. id at, nisi Donec tincidunt convallis. Nunc ullamcorper vitae nec quis Nunc elit tempor ex. varius vitae dui. ipsum malesuada Morbi efficitur. urna vel Nunc elit. non. cursus ac dui In
            </p>
            <p>
              tincidunt porta eget enim. ullamcorper nibh ac urna. sodales. Vestibulum ex est. tempor Donec venenatis sodales. facilisis ex. sed massa commodo in eu Nullam dolor ullamcorper In tortor. laoreet vehicula, nec Nunc Sed efficitur. maximus
            </p>
            <p>
              maximus lacus sit ex ex. vel elit In eget sapien tortor. ac ipsum scelerisque diam volutpat enim. lacus ac sed Sed hendrerit laoreet faucibus cursus elit id urna. Ut tincidunt tincidunt dui. Sed odio lorem. luctus maximus Donec nec quis
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TnC
