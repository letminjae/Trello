import React, { KeyboardEventHandler, useState } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { toDoState } from '../atoms';
import { SubmitHandler, useForm } from 'react-hook-form';
import clsx from 'clsx';

const AddButtonContainer = styled.div`
    width: 100%;
    min-width: 300px;
    max-width: 300px;
    padding: 10px;
    margin-top: 10px;
    background-color: ${(props) => props.theme.boardColor};
    border-radius: 5px;

    button {
        background-color: ${(props) => props.theme.cardBgColor};
        color: #222222;
        outline: none;
        font-weight: 600;
        font-size: 18px;
        border-radius: 8px;
        width: 100%;
        padding: 5px;
        border: none;
        cursor: pointer;
        margin: 5px 0;
    }

    form {
        width: 100%;
        background-color: inherit;
    }
    input {
        outline: none;
        border: 1px solid ${(props) => props.theme.textColor};
        padding: 5px 10px;
        border-radius: 5px;
        width: 100%;
    }

    .hidden {
        display: none;
    }
    .visible {
        display: block;
    }
`;

type AddCategoryForm = {
    category: string;
};

export const AddCategoryButton: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [todos, setTodos] = useRecoilState(toDoState);
    const { register, handleSubmit, setValue, setFocus } =
        useForm<AddCategoryForm>({
            mode: 'onBlur',
            defaultValues: { category: '' },
        });

    const onClickAdd = () => {
        setFocus('category');
        if (!open) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };
    const onKeyPress: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Escape') {
            setOpen(false);
            setValue('category', '');
        }
    };

    const onValid: SubmitHandler<AddCategoryForm> = ({ category }) => {
        if (category !== '') {
            if (
                Object.keys(todos).some(
                    (v) => v.toLowerCase() === category.toLowerCase(),
                )
            )
                return;
            setTodos({ ...todos, [category]: [] });
            setValue('category', '');
        }
        setOpen(false);
    };

    return (
        <AddButtonContainer>
            <form
                onSubmit={handleSubmit(onValid)}
                className={clsx(open ? 'visible' : 'hidden')}
            >
                <input
                    type={'text'}
                    {...register('category', { required: true })}
                    placeholder={
                        "추가할 카테고리를 입력하세요."
                    }
                    onKeyDown={onKeyPress}
                />
            </form>
            {!open && <button onClick={onClickAdd}>Add Category</button>}
        </AddButtonContainer>
    );
};