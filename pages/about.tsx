// export default function About() {
//   return (
//     <>
//       <section className="section section_info section_info_opposite">
//         <div className="container">
//           <div className="row">
//             <div className="col">
//               <p className="section__subheading text-center"></p>

//               <p>
//                 On August 21, 2018, a lifelong dream of chef/owner Mark Carruth
//                 and his soulmate Jeanne Schneider became a reality at the corner
//                 of Nyberg and Martinazzi in Tualatin, Oregon. After spending
//                 most of their lives working in corporate restaurants, this
//                 talented and personable couple launched a small, unique,
//                 upscale, family restaurant and bar that provides all of the
//                 following and more:
//               </p>

//               <ul>
//                 <li>
//                   Excellent appetizers, soups, salads, and entrees created,
//                   prepared, and plated by Chef Mark and delivered by Jeanne
//                 </li>
//                 <br />
//                 <li>
//                   A relaxing atmosphere for lunch, happy hour, and dinner, where
//                   Mark and Jeanne take pride in visiting with and getting to
//                   know their customers
//                 </li>
//                 <br />
//                 <li>
//                   A new go-to "date night" destination, yet one that is also
//                   enjoyed by families with children
//                 </li>
//               </ul>

//               <p>
//                 Avanti now offers an exceptional culinary experience not
//                 previously available in this section of the Portland
//                 metropolitan area.
//               </p>
//             </div>
//           </div>
//           <div className="row align-items-justify">
//             <div className="col-md-6 order-md-3"></div>
//             <div className="col-md-1 order-md-2"></div>
//             <div className="col-md-5 order-md-1">
//               <div className="section_info__body">
//                 <p className="lead text-heading"></p>
//                 <p></p>
//                 <br />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="section section_map">
//         <div
//           className="section_map__map"
//           data-lat="45.3830129"
//           data-lng="-122.75848759999997"
//           data-zoom="12"
//           data-info="<h4 className='section_map__map__heading text-center'>Avanti - Restaurant & Bar</h4><p className='section_map__map__content text-center text-muted'>7995 SW Nyberg St, Tualatin, OR 97062<br>(503)-826-5631</p>"
//         ></div>
//       </section>
//     </>
//   );
// }

import { ParallaxBanner, Parallax } from "react-scroll-parallax";

export default function About() {
  return (
    <>
      <header>
        <div className="pt-10 pb-8 pt-md-15 pb-md-13 bg-black-50">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-8 col-lg-6 text-center">
                <h1 className="display-6 fw-bold text-white">About Us</h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section className="py-7 py-md-9">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center">
              <h2 className="mb-2">Behind the Scenes</h2>

              <p className="mb-6">Something interesting or whatever</p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-light" style={{ height: "30rem" }}>
        <div
          data-lat="45.3830129"
          data-lng="-122.75848759999997"
          data-zoom="12"
          data-info="<h4 className='section_map__map__heading text-center'>Avanti - Restaurant & Bar</h4><p className='section_map__map__content text-center text-muted'>7995 SW Nyberg St, Tualatin, OR 97062<br>(503)-826-5631</p>"
        ></div>
      </section>
    </>
  );
}
