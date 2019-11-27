import { link } from '../mixins/link';
import { VantComponent } from '../common/component';
VantComponent({
    relation: {
        name: 'grid',
        type: 'ancestor',
        linked(parent) {
            this.parent = parent;
        }
    },
    mixins: [link],
    props: {
        icon: String,
        dot: Boolean,
        info: null,
        text: String,
        useSlot: Boolean
    },
    mounted() {
        this.updateStyle();
    },
    methods: {
        updateStyle() {
            if (!this.parent) {
                return;
            }
            const { data, children } = this.parent;
            const { columnNum, border, square, gutter, clickable, center } = data;
            const width = `${100 / columnNum}%`;
            const styleWrapper = [];
            const contentStyleWrapper = [];
            styleWrapper.push(`width: ${width}`);
            if (square) {
              styleWrapper.push(`padding-top: ${width}`);
            }
            if (gutter) {
                styleWrapper.push(`padding-right: ${gutter}px`);
                const index = children.indexOf(this);
                if (index >= columnNum && !square) {
                    styleWrapper.push(`margin-top: ${gutter}px`);
                }
                if(square){
                  contentStyleWrapper.push(`right: ${gutter}px`)
                  contentStyleWrapper.push(`bottom: ${gutter}px`)
                  contentStyleWrapper.push(`height: auto`)
                }
            }
            this.setData({
                style: styleWrapper.join('; '),
                contentStyle: contentStyleWrapper.join('; '),
                center,
                border,
                square,
                gutter,
                clickable
            });
        },
        onClick() {
            this.$emit('click');
            this.jumpLink();
        }
    }
});
