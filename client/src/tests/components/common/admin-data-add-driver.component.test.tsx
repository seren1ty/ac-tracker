import { act } from 'react-dom/test-utils';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import AdminDataAddDriver from '../../../components/common/admin-data-add-driver.component';

describe('AdminDataAddDriver', () => {

    let expectedProps: any;

    beforeEach(() => {
        expectedProps = {
            onSave: jest.fn(),
            onCancel: jest.fn()
        }
    });

    it('calls prop onSave function', () => {
        act(() => {
            render(<AdminDataAddDriver onSave={expectedProps.onSave} onCancel={expectedProps.onCancel} />);
        });

        const button = document.querySelector("#SaveButton");

        act(() => {
            button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(expectedProps.onSave).toBeCalled();
    })

    it('calls prop onCancel function', () => {
        act(() => {
            render(<AdminDataAddDriver onSave={expectedProps.onSave} onCancel={expectedProps.onCancel} />);
        });

        const button = document.querySelector("#CancelButton");

        act(() => {
            button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(expectedProps.onCancel).toBeCalled();
    })
});