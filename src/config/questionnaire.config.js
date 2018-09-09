import { formatData }           from 'wow-cool/lib/date.lib'

export const FREE_QUESTION = {
    Name: {
        label: '姓名',
        placeholder: '请输入您的姓名',
        value: '',
        use_check: [
            {
                nonempty: true,
                prompt: '请输入您的姓名'
            }
        ]
    },
    Sex: {
        label: '性别',
        value: 1,
        use_radio: [
            {
                label: '男',
                value: 1,
            },
            {
                label: '女',
                value: 0,
            }
        ]
    },
    Brithday: {
        value: '',
        label: '出生年月',
        use_check: [
            {
                nonempty: true,
                prompt: '请输入您的出生年月'
            }
        ],
        start: '1901-01-01',
        end: formatData('yyyy-MM-dd'),
    },
};

export const PAY_QUESTION = {
    Name: {
        label: '姓名',
        placeholder: '请输入您的姓名',
        value: '',
        use_check: [
            {
                nonempty: true,
                prompt: '请输入您的姓名'
            }
        ]
    },
    Sex: {
        label: '性别',
        value: 1,
        use_radio: [
            {
                label: '男',
                value: 1,
            },
            {
                label: '女',
                value: 0,
            }
        ]
    },
    Brithday: {
        value: '',
        label: '出生年月',
        use_check: [
            {
                nonempty: true,
                prompt: '请输入您的出生年月'
            }
        ]
    },
    Height: {
        label: '身高',
        placeholder: '请输入您的身高',
        value: '',
        use_check: [
            {
                nonempty: true,
                prompt: '请输入您的身高'
            }
        ],
        unit: 'cm',
    },
    Weight: {
        label: '体重',
        placeholder: '请输入您的体重',
        value: '',
        use_check: [
            {
                nonempty: true,
                prompt: '请输入您的体重'
            }
        ],
        unit: 'kg',
    },
    Mobile: {
        label: '手机号',
        placeholder: '请输入您的手机号',
        type: 'tel',
        value: '',
        use_check: [
            {
                nonempty: true,
                prompt: '请输入您的手机号'
            }
        ]
    },
};
