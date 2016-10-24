/**
 * @file Templates used by Chart.js for Pageviews app
 * @author MusikAnimal
 * @copyright 2016 MusikAnimal
 */

/**
 * Templates used by Chart.js.
 * Functions used within our app must be in the global scope.
 * All quotations must be double-quotes or properly escaped.
 * @type {Object}
 */
const templates = {
  chartLegend(scope) {
    const dataList = (entity, multiEntity = false) => {
      let editsLink;

      if (multiEntity) {
        editsLink = scope.formatNumber(entity.num_edits);
      } else {
        editsLink = scope.getHistoryLink(entity.label, scope.formatNumber(entity.num_edits));
      }

      let infoHash = {
        'Pageviews': {
          'Pageviews': scope.formatNumber(entity.sum),
          'Daily average': scope.formatNumber(entity.average)
        },
        'Revisions': {
          'Edits': editsLink,
          'Editors': scope.formatNumber(entity.num_users)
        },
        'Basic information': {
          'Watchers': entity.watchers ? scope.formatNumber(entity.watchers) : $.i18n('unknown')
        }
      };

      if (!multiEntity) {
        Object.assign(infoHash['Basic information'], {
          'Size': entity.length ? scope.formatNumber(entity.length) : '',
          'Protection': entity.protection
        });
      }

      let markup = '';

      for (let block in infoHash) {
        markup += `<div class='legend-block'><h5>${block}</h5><hr/>`;
        for (let key in infoHash[block]) {
          const value = infoHash[block][key];
          if (!value) continue;
          markup += `
            <div class="linear-legend--counts">
              ${key}:
              <span class='pull-right'>
                ${value}
              </span>
            </div>`;
        }
        markup += '</div>';
      }

      if (!multiEntity) {
        markup += `
          <div class="linear-legend--links">
            <a href="${scope.getLangviewsURL(entity.label)}" target="_blank">${$.i18n('all-languages')}</a>
            &bullet;
            <a href="${scope.getRedirectviewsURL(entity.label)}" target="_blank">${$.i18n('redirects')}</a>
          </div>`;
      }

      return markup;
    };

    // map out edit protection level for each entity
    // const entities = scope.outputData.map(entity => {
    //   const protection = (entity.protection || []).find(prot => prot.type === 'edit');
    //   entity.protection = protection ? protection.level : $.i18n('none').toLowerCase();
    //   return entity;
    // });

    if (scope.outputData.length === 1) {
      return dataList(scope.outputData[0]);
    }

    const sum = scope.outputData.reduce((a,b) => a + b.sum, 0);
    const totals = {
      sum,
      average: Math.round(sum / scope.outputData.length),
      num_edits: scope.outputData.reduce((a, b) => a + b.num_edits, 0),
      num_users: scope.outputData.reduce((a, b) => a + b.num_users, 0),
      watchers: scope.outputData.reduce((a, b) => a + b.watchers || 0, 0)
    };

    return dataList(totals, true);
  },

  tableRow(scope, item, last = false) {
    const tag = last ? 'th' : 'td';
    const historyRow = last ? scope.formatNumber(item.num_edits) :
      scope.getHistoryLink(item.label, scope.formatNumber(item.num_edits));
    const linksRow = last ? '' : `
        <a href="${scope.getLangviewsURL(item.label)}" target="_blank">${$.i18n('all-languages')}</a>
        &bull;
        <a href="${scope.getRedirectviewsURL(item.label)}" target="_blank">${$.i18n('redirects')}</a>
      `;

    return `
      <tr>
        <${tag} class='table-view--color-col'>
          <span class='table-view--color-block' style="background:${item.color}"></span>
        </${tag}>
        <${tag}>${last ? item.label : scope.getPageLink(item.label)}</${tag}>
        <${tag}>${scope.formatNumber(item.sum)}</${tag}>
        <${tag}>${scope.formatNumber(item.average)}</${tag}>
        <${tag}>${historyRow}</${tag}>
        <${tag}>${scope.formatNumber(item.num_users)}</${tag}>
        <${tag}>${scope.formatNumber(item.length)}</${tag}>
        <${tag}>${item.protection}</${tag}>
        <${tag}>${item.watchers ? scope.formatNumber(item.watchers) : $.i18n('unknown')}</${tag}>
        <${tag}>${linksRow}</${tag}>
      </tr>
    `;
  }
};

module.exports = templates;
