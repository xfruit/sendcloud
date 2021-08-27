/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  15/8/10
 * @description
 *
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _configMail = require("../config/mail");

var _configMail2 = _interopRequireDefault(_configMail);

var _request = require("irequest");

var _request2 = _interopRequireDefault(_request);

var ListMember = (function () {
  function ListMember(apiUser, apiKey) {
    _classCallCheck(this, ListMember);

    this.apiUser = apiUser;
    this.apiKey = apiKey;
  }

  _createClass(ListMember, [{
    key: "getData",
    value: function getData(url, data) {
      data.api_key = this.apiKey;
      data.api_user = this.apiUser;
      return new Promise(function (resolve, reject) {
        _request2["default"].post({ url: url, form: data }, function (err, res, body) {
          if (err) {
            reject(err);
          }
          try {
            var sendInfo = JSON.parse(body);
            resolve(sendInfo);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  }, {
    key: "getListMember",
    value: function getListMember(mail_list_addr, options) {
      options = options || {};
      options.mail_list_addr = mail_list_addr;
      return this.getData(_configMail2["default"].api.member_get, options);
    }
  }, {
    key: "addListMember",

    /**
     *
     * @param mail_list_addr (string)      地址列表名称
     * @param member_addr (string)     需添加成员的地址, 多个地址使用分号;分开
     * @param name
     * @param options
     *          name(string,地址所属人名称, 与member_addr一一对应, 多个名称用;分隔)
     *          vars(string,模板替换的变量, 与member_addr一一对应, 变量格式为{'%money%':1000}, 多个用;分隔)
     *          description(string,对列表的描述信息)
     *          upsert(string(false,true),是否允许更新, 当为true时, 如果该member_addr存在, 则更新; 为false时, 如果成员地址存在, 将报重复地址错误, 默认为false)
     *
     * @returns {*}
     */
    value: function addListMember(mail_list_addr, member_addr, name, options) {
      options = options || {};
      var _data = ListMember.getListMemberData(mail_list_addr, member_addr, name, options);
      return this.getData(_configMail2["default"].api.member_add, _data);
    }

    /**
     *
     * @param mail_list_addr  (string)地址列表名称
     * @param member_addr (array)  要删除的邮件数组
     * @returns {*}
     */
  }, {
    key: "deleteListMember",
    value: function deleteListMember(mail_list_addr, member_addr) {
      return this.getData(_configMail2["default"].api.member_delete, {
        mail_list_addr: mail_list_addr,
        member_addr: member_addr
      });
    }

    /**
     * 将目前souceList列表里所有的邮箱添加到种子targetList列表
     * 1.先获取所有的邮箱
     * 2.将所有的邮箱按格式添加到seed列表中
     * @param souceList
     * @param targetList
     */
  }, {
    key: "addToOtherList",
    value: function addToOtherList(souceList, targetList) {
      var limitOptions = {
        start: 0,
        limit: 1000
      };
      return getListMember(souceList, limitOptions).then(function (data) {
        var wantList = data.members; // 需要添加的成员
        return Promise.map(wantList, function (member) {
          var _name = member.vars["%name%"];
          var options = {
            // 邮件变量
            vars: {
              "domain": member.vars["%domain%"],
              "avatar": member.vars["%avatar%"]
            }
          };
          return addListMember(targetList, member.address, _name, options);
        }).then(function (data) {
          return data;
        });
      })["catch"](function (err) {
        console.log(err);
      });
    }
  }], [{
    key: "getListMemberData",
    value: function getListMemberData(mail_list_addr, member_addr, name, options) {
      if (options) {
        if (options.vars) {
          options.vars = JSON.stringify(options.vars);
        }
      }
      options.mail_list_addr = mail_list_addr;
      options.member_addr = member_addr;
      options.name = name;
      return options;
    }
  }]);

  return ListMember;
})();

exports["default"] = ListMember;
module.exports = exports["default"];