import Abe from "../assests/Abraham Dionne.png";
import Daniel from "../assests/Daniel Feng.jpg";
import Reda from "../assests/Reda Boutayeb.png";
import Hien from "../assests/Hien Hoang.png";
import Lucas from "../assests/Lucas Lamenha.jpg";
import Miya from "../assests/Miya Judy.png";
import Oliver from "../assests/Oliver Gates.jpg";
import Philip from "../assests/Philip Heney.jpg";
import Giovanni from "../assests/Giovanni Larson Vasquez.jpg";
import Felix from "../assests/Felix Nguyen.jpg";

const About = () => {
  return (
    <div className="text-center p-16 flex flex-col items-center h-screen container">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        WPI Computer Science Department, CS3733-C24 Software Engineering
      </h1>
      <h1 className="py-1 text-md italic font-semibold text-gray-500 dark:text-gray-400">
        Prof. Wilson Wong, Coach: Ari Schechter
      </h1>

      <div className="container mx-auto p-12 grid grid-cols-2 gap-8">
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            data-popover-target="popover-reda"
            data-popover-trigger="click"
            data-popover-placement="right"
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Reda}
            alt=""
          />
          <div
            id="popover-reda"
            role="tooltip"
            className="absolute z-10 invisible inline-block space-x-6 w-86 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
          >
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Favorite Quote
              </h3>
            </div>
            <div className="px-3 py-2 dark:text-white">
              <p>"Small circle, private life, peaceful mind” - Unknown</p>
            </div>
          </div>

          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Reda Boutayeb
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Assistant Lead Software + Algorithms
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg  md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            data-popover-target="popover-abe"
            data-popover-trigger="click"
            data-popover-placement="right"
            className="object-cover w-full rounded-t-lg h-96 md:w-48 md:rounded-none md:rounded-s-lg"
            src={Abe}
            alt=""
          />
          <div
            id="popover-abe"
            role="tooltip"
            className="absolute z-10 invisible inline-block space-x-6 w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
          >
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Favorite Quote
              </h3>
            </div>
            <div className="px-3 py-2 dark:text-white">
              <p>
                “I’m not superstitious, but I am a little stitious.” — Michael
                Scott
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Abraham Dionne
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Scrum Master + Front End
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg  md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            data-popover-target="popover-daniel"
            data-popover-trigger="click"
            data-popover-placement="right"
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Daniel}
            alt=""
          />
          <div
            id="popover-daniel"
            role="tooltip"
            className="absolute z-10 invisible inline-block space-x-6 w-86 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
          >
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Favorite Quote
              </h3>
            </div>
            <div className="px-3 py-2 dark:text-white">
              <p>"Noot noot. I'm in." -Michelle Yu</p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Daniel Feng
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Project Manager + Front End
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg  md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            data-popover-target="popover-oliver"
            data-popover-trigger="click"
            data-popover-placement="right"
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Oliver}
            alt=""
          />
          <div
            id="popover-oliver"
            role="tooltip"
            className="absolute z-10 invisible inline-block space-x-6 w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
          >
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Favorite Quote
              </h3>
            </div>
            <div className="px-3 py-2 dark:text-white">
              <p>
                “I’m running around New York with a pack of wild lesbians!” -
                Billy Eichner
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Oliver Gates
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Front End
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg  md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            data-popover-target="popover-philip"
            data-popover-trigger="click"
            data-popover-placement="right"
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Philip}
            alt=""
          />
          <div
            id="popover-philip"
            role="tooltip"
            className="absolute z-10 invisible inline-block space-x-6 w-86 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
          >
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Favorite Quote
              </h3>
            </div>
            <div className="px-3 py-2 dark:text-white">
              <p>“This is a quote.” - Philip Heney</p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Philip Heney
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Documentation Analyst + Front End
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg  md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            data-popover-target="popover-hien"
            data-popover-trigger="click"
            data-popover-placement="right"
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Hien}
            alt=""
          />
          <div
            id="popover-hien"
            role="tooltip"
            className="absolute z-10 invisible inline-block space-x-6 w-86 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
          >
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Favorite Quote
              </h3>
            </div>
            <div className="px-3 py-2 dark:text-white">
              <p>“I’m fa(n)t(tastic).” - Hien Hoang</p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Hien Hoang
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Database + Algorithms
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg  md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            data-popover-target="popover-miya"
            data-popover-trigger="click"
            data-popover-placement="right"
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Miya}
            alt=""
          />
          <div
            id="popover-miya"
            role="tooltip"
            className="absolute z-10 invisible inline-block space-x-6 w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
          >
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Favorite Quote
              </h3>
            </div>
            <div className="px-3 py-2 dark:text-white">
              <p>
                “You don’t have time to be timid you must be bold. Daring.”
                -Lumiere
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-4 leading-normal text-center">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Miya Judy
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Product Owner + Front End
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg  md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            data-popover-target="popover-lucas"
            data-popover-trigger="click"
            data-popover-placement="right"
            className="object-cover w-full rounded-t-lg h-96  md:w-52 md:rounded-none md:rounded-s-lg"
            src={Lucas}
            alt=""
          />
          <div
            id="popover-lucas"
            role="tooltip"
            className="absolute z-10 invisible inline-block space-x-6 w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
          >
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Favorite Quote
              </h3>
            </div>
            <div className="px-3 py-2 dark:text-white">
              <p>
                “You only live once, but if you do it right, once is enough.”
                Mae West
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Lucas Lamenha
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Assistant Lead Software Engineer + Databases
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg  md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            data-popover-target="popover-giovanni"
            data-popover-trigger="click"
            data-popover-placement="right"
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Giovanni}
            alt=""
          />
          <div
            id="popover-giovanni"
            role="tooltip"
            className="absolute z-10 invisible inline-block space-x-6 w-86 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
          >
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Favorite Quote
              </h3>
            </div>
            <div className="px-3 py-2 dark:text-white">
              <p>"This was fun 🥲" - Giovanni</p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-4 leading-normal space-x-8">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Giovanni Larson Vasquez
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Front end + database
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg  md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <img
            data-popover-target="popover-felix"
            data-popover-trigger="click"
            data-popover-placement="right"
            className="object-cover w-full rounded-t-lg h-96  md:w-48 md:rounded-none md:rounded-s-lg"
            src={Felix}
            alt=""
          />
          <div
            id="popover-felix"
            role="tooltip"
            className="absolute z-10 invisible inline-block space-x-6 w-86 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
          >
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Favorite Quote
              </h3>
            </div>
            <div className="px-3 py-2 dark:text-white">
              <p>"I don't know" - Felix</p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Thinh (Felix) Nguyen
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Lead Software Engineer + Front end + Databases
            </p>
          </div>
        </div>
      </div>

      <p className="py-4 text-md italic font-semibold text-gray-500 dark:text-gray-400">
        Thanks to Brigham and Women's Hospital and their representative, Andrew
        Shinn.
      </p>
      <p
        className="text-center text-md italic font-semibold text-gray-500 dark:text-gray-400"
        style={{
          textWrap: "balance",
        }}
      >
        The Brigham & Women's Hospital maps and data used in this application
        are copyrighted and provided for the sole use of educational purposes.
      </p>
    </div>
  );
};

export { About };
