import { JSX } from 'react/jsx-runtime';
import { useState } from 'react';
import Modal, { ModalProps } from './Modal';
import { customizeColors } from '../../utils/theme/color';

export interface CategoryColorsProp {
    Body: string,
    Face: string;
    Eye: string;
    Ear: string;

}

interface Props extends ModalProps {
    handleColorClick: (color: string, selectedCategory: 'Body' | 'Face' | 'Eye' | 'Ear') => void,
    categoryColors: CategoryColorsProp
}

const ColorPicker = (props: Props): JSX.Element => {
    const [selectedCategory, setSelectedCategory] = useState<'Body' | 'Face' | 'Eye' | 'Ear'>('Body');


    const handleCategoryClick = (category: 'Body' | 'Face' | 'Eye' | 'Ear') => {
        setSelectedCategory(category);
    };



    return (
        <Modal {...props}>
            <div className='mb-3 text-white w-64'>
                <h1 className='text-3xl uppercase tracking-wider'>Customize</h1>
                <hr />
                <div className="grid grid-cols-4 pt-2 uppercase items-center justify-center">
                    {['Body', 'Face', 'Eye', 'Ear'].map(category => (
                        <button
                            key={category}
                            className={`text-center uppercase py-1 px-2 ${selectedCategory === category ? ' text-white' : ' text-gray-400'
                                }`}
                            onClick={() => handleCategoryClick(category as 'Body' | 'Face' | 'Eye' | 'Ear')}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <hr />
                <div className="grid grid-cols-5 w-full items-center gap-x-5 gap-y-2 py-2">
                    {customizeColors.map((color, index) => (
                        <div
                            key={index}
                            className={`cursor-pointer h-5 border-2 ${props.categoryColors[selectedCategory] === color ? 'border-white' : 'border-dark'
                                }`}
                            style={{ backgroundColor: color }}
                            onClick={() => props.handleColorClick(color, selectedCategory)}
                        ></div>
                    ))}
                </div>
                <hr />

            </div>
        </Modal>
    );
};

export default ColorPicker;
