/**
 * 列挙型を定義するための基礎クラス
 */
class EnumBase
{
    get Name() { return this._name; }

    constructor(in_name) {
        this._name = in_name;
    }

    Is(in_type) {
        return (this._name === in_type._name);
    }
}