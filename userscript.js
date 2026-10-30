// ==UserScript==
// @name         X 创作者数据中文汉化
// @namespace    https://local.x-analytics-zh
// @version      1.0.1
// @description  汉化 x.com/i/account_analytics 创作者数据页英文字段
// @match        https://x.com/*
// @match        https://twitter.com/*
// @match        https://mobile.x.com/*
// @match        https://mobile.twitter.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// ==/UserScript==

/**
 * X Creator Analytics → 简体中文
 * 覆盖 SPA 进入 /i/account_analytics；整段精确匹配 + 常见控件文案。
 */
(function () {
  "use strict";

  const DICT = {
    "Account overview": "账号总览",
    "Account Overview": "账号总览",
    "Creator Studio": "创作者工作室",
    "Creator studio": "创作者工作室",
    Analytics: "数据分析",
    Content: "内容",
    Audience: "受众",
    Video: "视频",
    Live: "直播",
    Spaces: "空间",
    Overview: "概览",
    Monetization: "收益变现",
    Verified: "已认证",
    "Select secondary metric": "选择次要指标",
    "Select Secondary Metric": "选择次要指标",
    Daily: "按日",
    Weekly: "按周",
    Monthly: "按月",
    Bar: "柱状图",
    Line: "折线图",
    "Past 7 days": "近 7 天",
    "Last 7 days": "近 7 天",
    "Past 28 days": "近 28 天",
    "Last 28 days": "近 28 天",
    "Past 3 months": "近 3 个月",
    "Last 3 months": "近 3 个月",
    "Past year": "近一年",
    "Last 12 months": "近一年",
    "Past 12 months": "近一年",
    Custom: "自定义",
    "All time": "全部时间",
    Impressions: "曝光量",
    "Engagement rate": "互动率",
    "Engagement Rate": "互动率",
    Engagements: "互动次数",
    "Profile visits": "主页访问",
    "Profile Visits": "主页访问",
    "New follows": "新关注",
    "New followers": "新关注",
    "New Follows": "新关注",
    "New Followers": "新关注",
    "Follows over time": "关注变化",
    "Follows Over Time": "关注变化",
    Unfollows: "取消关注",
    Followers: "关注者",
    Following: "正在关注",
    Posts: "帖子",
    Replies: "回复",
    Bookmarks: "书签",
    Likes: "喜欢",
    Reposts: "转帖",
    Quotes: "引用",
    "Quote Tweets": "引用推文",
    Shares: "分享",
    Shared: "分享",
    "Detail expands": "详情展开",
    "Detail Expands": "详情展开",
    "Link clicks": "链接点击",
    "Link Clicks": "链接点击",
    "URL clicks": "链接点击",
    "User profile clicks": "主页点击",
    "Hashtag clicks": "话题点击",
    "Media views": "媒体观看",
    "Media Views": "媒体观看",
    "Video views": "视频观看",
    "Video Views": "视频观看",
    "Video views (organic)": "视频观看（自然）",
    "App opens": "应用打开",
    "App installs": "应用安装",
    "View post analytics": "查看帖子数据",
    "View Post Analytics": "查看帖子数据",
    "Post analytics": "帖子数据",
    "Post Analytics": "帖子数据",
    Export: "导出",
    "Export data": "导出数据",
    Download: "下载",
    "See more": "查看更多",
    "Show more": "展开更多",
    "Show less": "收起",
    "Top posts": "热门帖子",
    "Top Posts": "热门帖子",
    "Your posts": "你的帖子",
    Organic: "自然流量",
    Promoted: "推广",
    Paid: "付费",
    "Top locations": "主要地区",
    "Top Locations": "主要地区",
    "Top interests": "主要兴趣",
    Gender: "性别",
    Age: "年龄",
    Interests: "兴趣",
    Locations: "地区",
    "Audience insights": "受众洞察",
    "Audience Insights": "受众洞察",
    "Estimated earnings": "预估收益",
    Earnings: "收益",
    "Ad revenue sharing": "广告分成",
    Subscriptions: "订阅",
    Tips: "打赏",
    "Ticketed Spaces": "收费空间",
    "No data available": "暂无数据",
    "Not enough data": "数据不足",
    "Try again later": "请稍后再试",
    Loading: "加载中",
    Updated: "已更新",
    "Last updated": "最近更新",
  };

  const ATTRS = ["title", "aria-label", "placeholder", "alt"];
  const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE"]);

  function onAnalyticsPage() {
    const p = location.pathname || "";
    return (
      p.includes("/i/account_analytics") ||
      p.includes("/account_analytics") ||
      /\/i\/verified-program/.test(p) ||
      /\/analytics\/?$/.test(p)
    );
  }

  function translateExact(s) {
    if (s == null) return null;
    const trimmed = String(s).replace(/\u00a0/g, " ").trim();
    if (!trimmed) return null;
    return Object.prototype.hasOwnProperty.call(DICT, trimmed) ? DICT[trimmed] : null;
  }

  function replaceTextNode(node) {
    const raw = node.nodeValue;
    if (raw == null || !/\S/.test(raw)) return;
    const lead = raw.match(/^\s*/)[0];
    const trail = raw.match(/\s*$/)[0];
    const core = raw.slice(lead.length, raw.length - trail.length).replace(/\u00a0/g, " ");
    const zh = translateExact(core);
    if (zh != null && node.nodeValue !== lead + zh + trail) {
      node.nodeValue = lead + zh + trail;
    }
  }

  function replaceAttrs(el) {
    if (!el || el.nodeType !== 1) return;
    for (const attr of ATTRS) {
      if (!el.hasAttribute(attr)) continue;
      const val = el.getAttribute(attr);
      const zh = translateExact(val);
      if (zh != null) el.setAttribute(attr, zh);
    }
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      replaceTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    if (SKIP.has(root.tagName)) return;
    if (root.tagName === "INPUT") {
      replaceAttrs(root);
      return;
    }
    replaceAttrs(root);
    const kids = root.childNodes;
    for (let i = 0; i < kids.length; i++) walk(kids[i]);
  }

  let scheduled = false;
  function scheduleFull() {
    if (!onAnalyticsPage()) return;
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      if (document.body) walk(document.body);
    });
  }

  let obs = null;
  function ensureObserver() {
    if (obs || !document.body) return;
    obs = new MutationObserver((mutations) => {
      if (!onAnalyticsPage()) return;
      let needFull = false;
      for (const m of mutations) {
        if (m.type === "characterData") {
          replaceTextNode(m.target);
        } else if (m.type === "childList") {
          m.addedNodes.forEach((n) => walk(n));
          if (m.addedNodes.length) needFull = true;
        } else if (m.type === "attributes" && ATTRS.includes(m.attributeName)) {
          replaceAttrs(m.target);
        }
      }
      // React 下拉菜单常整块重绘，补一轮全量
      if (needFull) scheduleFull();
    });
    obs.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });
  }

  function hookHistory() {
    const wrap = (fn) =>
      function () {
        const r = fn.apply(this, arguments);
        queueMicrotask(scheduleFull);
        return r;
      };
    try {
      history.pushState = wrap(history.pushState);
      history.replaceState = wrap(history.replaceState);
    } catch (_) {}
    window.addEventListener("popstate", scheduleFull);
  }

  function boot() {
    ensureObserver();
    hookHistory();
    scheduleFull();
    // SPA 晚渲染：多扫几次
    setTimeout(scheduleFull, 500);
    setTimeout(scheduleFull, 1500);
    setTimeout(scheduleFull, 3000);
    setInterval(() => {
      if (onAnalyticsPage()) scheduleFull();
    }, 4000);
  }

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
