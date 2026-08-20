import powerbi from "powerbi-visuals-api";
import DataViewTable = powerbi.DataViewTable;
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;

function valueAt(row: powerbi.DataViewTableRow, columns: DataViewMetadataColumn[], roles: string[]): unknown {
    for (let i = 0; i < columns.length; i += 1) {
        const columnRoles = columns[i].roles || {};
        if (roles.some((role) => !!columnRoles[role])) return row[i];
    }
    return undefined;
}
function text(value: unknown): string {
    if (value === null || value === undefined || value === "") return "—";
    return String(value);
}
function numberValue(value: unknown): number {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : 0;
}
function root(container: HTMLElement, className: string): HTMLDivElement {
    container.replaceChildren();
    const element = document.createElement("div");
    element.className = className;
    container.appendChild(element);
    return element;
}
export function renderChart(container: HTMLElement, table: DataViewTable, columns: DataViewMetadataColumn[]): void {
    const view = root(container, "dlt-variant dlt-fflexacha");
    const title = document.createElement("div");
    title.className = "dlt-variant__heading";
    title.textContent = "FFLEXACHA";
    view.appendChild(title);
    const chart = document.createElement("div");
    chart.className = "dlt-fflexacha__chart";
    const values = (table.rows || []).map((row) => numberValue(valueAt(row, columns, ["values", "value"])));
    const max = Math.max(...values, 1);
    (table.rows || []).forEach((row, index) => {
        const item = document.createElement("div");
        item.className = "dlt-fflexacha__item";
        const label = document.createElement("span");
        label.className = "dlt-fflexacha__label";
        label.textContent = text(valueAt(row, columns, ["category", "rows", "row"]));
        const bar = document.createElement("span");
        bar.className = "dlt-fflexacha__bar";
        bar.style.width = `${Math.max(2, (values[index] / max) * 100)}%`;
        bar.textContent = text(values[index]);
        item.append(label, bar);
        chart.appendChild(item);
    });
    view.appendChild(chart);
}
export function renderDesign(container: HTMLElement, table: DataViewTable, columns: DataViewMetadataColumn[]): void {
    const view = root(container, "dlt-variant dlt-fflexad");
    const header = document.createElement("div");
    header.className = "dlt-variant__heading";
    header.textContent = "FFLEXAD DESIGN SURFACE";
    view.appendChild(header);
    const cards = document.createElement("div");
    cards.className = "dlt-fflexad__cards";
    (table.rows || []).forEach((row) => {
        const card = document.createElement("article");
        card.className = "dlt-fflexad__card";
        const title = document.createElement("h3");
        title.textContent = text(valueAt(row, columns, ["category", "rows", "row"]));
        const value = document.createElement("strong");
        value.textContent = text(valueAt(row, columns, ["values", "value"]));
        const group = document.createElement("p");
        group.textContent = text(valueAt(row, columns, ["group", "series"]));
        card.append(title, value, group);
        cards.appendChild(card);
    });
    view.appendChild(cards);
}
