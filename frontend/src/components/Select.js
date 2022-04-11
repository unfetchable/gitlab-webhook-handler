import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import React, { Fragment } from "react";

const Select = ({ selectedItem, setSelectedItem, items, label }) => {
	return (
		<Listbox value={selectedItem} onChange={setSelectedItem}>
			{({ open }) => (
				<div className="relative z-10">
					<Listbox.Button className={`
						relative w-full py-2 pl-3 pr-10 text-left bg-black border-2 border-gray-700
						rounded-lg shadow-md cursor-default focus:outline-none sm:text-sm
					`}>
						<span className="block truncate">
							{label && (
								<span className="font-bold mr-2">{label}:</span>
							)}
							{selectedItem.name}
						</span>
						<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
							<ChevronDownIcon className={`w-5 h-5 text-white transition duration-100
								${open ? "transform rotate-180" : ""}
							`} />
						</span>
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave="duration-100 ease-out"
						leaveFrom="scale-100 opacity-100"
						leaveTo="scale-95 opacity-0"
					>
						<Listbox.Options className={`
							absolute w-full mt-2 overflow-auto text-gray-300 bg-black border-2 border-gray-700
							shadow-lg max-h-56 focus:outline-none sm:text-sm rounded-lg transition transform
						`}>
							{items.map((type, index) => (
								<Listbox.Option value={type} key={index} className={({ active }) => `
									${active ? "bg-gray-900" : ""} cursor-pointer select-none relative py-2
								`}>
									{({ selected }) => (
										<>
											<span className={`${selected ? "font-bold text-white" : ""} block truncate`}>
												{type.name}
											</span>
											{selected && (
												<span className={"absolute inset-y-0 left-0 flex items-center pl-3"}>
													<CheckIcon className="w-5 h-5 text-white" />
												</span>
											)}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			)}
		</Listbox>
	);
};

export default Select;
