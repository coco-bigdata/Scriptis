
import DB from '@js/helper/db.js';
import { config } from '@/config/db.js';
// 更新schema请用db.updateVersion(stores, version)
const db = new DB('bdp-ide', config.stores, config.version);
// 更改主键要先删掉原来的store才能更新，其他非主键修改直接调用updateVersion
// db.updateVersion(Object.assign({}, config.stores), config.version + 1);
/**
 * @class basic
 */
class Basic {
    /**
     *Creates an instance of basic.
     * @memberof basic
     * @param {*} table
     */
    constructor(table) {
        this.table = table;
    }

    /**
     * @param {Tab} tab
     * @param {*} id
     * @memberof Tab
     * @return {promise}
     */
    add(tab) {
        return db.put(this.table, tab);
    }
    /**
     * @param {string}key
     * @return {promise} tabList or query tab by key
     * @memberof Tab
     */
    get(key) {
        if (key) {
            return db.get(this.table, key);
        }
        return db.toArray(this.table);
    }
    /**
     *
     *
     * @param {*} key
     * @return {promise}
     * @memberof basic
     */
    remove(key) {
        return db.delete(this.table, key);
    }
    /**
     * @param {*} key
     * @param {*} changes
     * @return {*}
     */
    update(key, changes) {
        return db.update(this.table, key, changes);
    }
    /**
     *
     * @param {*} oldKey
     * @param {*} newKey
     */
    async modifyPrimaryKey(oldKey, newKey) {
        let object = await db.get(this.table, oldKey);
        if (object && object[0]) {
            await db.delete(this.table, oldKey);
            if (this.table === 'tab') {
                object[0].id = newKey;
                object = Object.assign(object, { id: newKey });
            } else {
                object[0].tabId = newKey;
                object = Object.assign(object, { tabId: newKey });
            }
            return db.put(this.table, object);
        }
    }
}
export {
    db,
    Basic,
}
;
