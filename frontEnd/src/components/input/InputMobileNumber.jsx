import React from "react";
import { useCountries } from "use-react-countries";
import {
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";

const InputMobileNumber = ({
  label = "",
  type = "",
  id = "",
  name= "",
  placeholder = "",
  value = "",
  onChange = "",
}) => {

          const { countries } = useCountries();
          const [country, setCountry] = useState(0);
          const { names, flags, countryCallingCode } = countries[country];

  return (
    <div className="mb-4">
      {label && (
        <label
          className="block text-xs font-medium text-gray-700"
          htmlFor={name}
        >
          {label} :
        </label>
      )}

      <div className="flex justify-center items-center">
        <Menu placement="bottom-start">
          <MenuHandler>
            <Button
              ripple={false}
              variant="text"
              color="blue-gray"
              className="flex h-10 items-center gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
            >
              <img
                src={flags.svg}
                alt={names}
                className="h-4 w-4 rounded-full object-cover"
              />
              {countryCallingCode}
            </Button>
          </MenuHandler>
          <MenuList className="max-h-[20rem] max-w-[18rem]">
            {countries.map(({ name, flags, countryCallingCode }, index) => {
              return (
                <MenuItem
                  key={names}
                  value={names}
                  className="flex items-center gap-2"
                  onClick={() => setCountry(index)}
                >
                  <img
                    src={flags.svg}
                    alt={names}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {names} <span className="ml-auto">{countryCallingCode}</span>
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
        <input
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default InputMobileNumber;
