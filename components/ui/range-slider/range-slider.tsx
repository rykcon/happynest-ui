// src/components/ui/RangeSlider.tsx
"use client";

import React, { useEffect, useId, useRef } from "react";

export type RangeSliderValue = [number, number];

type Props = {
	min: number;
	max: number;
	value: RangeSliderValue;
	onChange?: (v: RangeSliderValue) => void;

	step?: number;
	disabled?: boolean;

	showTooltips?: boolean;
	format?: (n: number) => string;

	className?: string;
};

export default function RangeSlider({
	min,
	max,
	value,
	onChange,
	step = 1,
	disabled = false,
	showTooltips = true,
	format = (n) => String(Math.round(n)),
	className = "",
}: Props) {
	const id = useId();
	const elRef = useRef<HTMLDivElement | null>(null);
	const sliderRef = useRef<any>(null);

	// init
	useEffect(() => {
		let destroyed = false;

		(async () => {
			if (!elRef.current) return;

			const noUiSliderMod = await import("nouislider");
			const noUiSlider = (noUiSliderMod as any).default ?? noUiSliderMod;

			if (destroyed) return;

			// Prevent double init (React strict/dev can re-run effects)
			if (sliderRef.current) return;

			noUiSlider.create(elRef.current, {
				start: value,
				step,
				range: { min, max },
				connect: true,
				tooltips: showTooltips
					? [
							{ to: (n: number) => format(n), from: (s: string) => Number(s) },
							{ to: (n: number) => format(n), from: (s: string) => Number(s) },
						]
					: false,
			});

			const slider = (elRef.current as any).noUiSlider;
			sliderRef.current = slider;

			slider.on("update", (vals: (string | number)[]) => {
				const a = Number(vals[0]);
				const b = Number(vals[1]);
				onChange?.([a, b]);
			});

			if (disabled) slider.setAttribute("disabled", true);
		})();

		return () => {
			destroyed = true;
			try {
				sliderRef.current?.destroy?.();
			} catch {}
			sliderRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// keep in sync when parent value changes
	useEffect(() => {
		const slider = sliderRef.current;
		if (!slider) return;
		try {
			const cur = slider.get?.() as [string, string] | undefined;
			const curA = cur ? Number(cur[0]) : NaN;
			const curB = cur ? Number(cur[1]) : NaN;

			// Avoid feedback loops: only set if materially different
			if (Number.isFinite(curA) && Number.isFinite(curB)) {
				if (
					Math.abs(curA - value[0]) < 0.0001 &&
					Math.abs(curB - value[1]) < 0.0001
				)
					return;
			}

			slider.set(value);
		} catch {}
	}, [value]);

	// enable/disable
	useEffect(() => {
		const slider = sliderRef.current;
		if (!slider) return;
		try {
			if (disabled) slider.setAttribute("disabled", true);
			else slider.removeAttribute("disabled");
		} catch {}
	}, [disabled]);

	return (
		<div className={className}>
			<div id={id} ref={elRef} />
		</div>
	);
}
